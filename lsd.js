var Transform = require('stream').Transform,
    fs = require('fs'),
    path = require('path');

function Lsd(opts) {
    if (!(this instanceof Lsd)) {
        return new Lsd(opts);
    }
    if (opts) {
        this.recurse = isBool(opts.recurse);
    } else {
        this.recurse = false;
    }
    this._count = 0;
    this._writeQ = [];
    this._current = null;
    this.done = null;
    Transform.call(this, { encoding : 'utf-8', decodeStrings : false  });
}

Lsd.prototype = Object.create(Transform.prototype, {
    constructor : {
        value : Lsd
    }
});

Lsd.prototype._transform = function(root, encoding, done) {
    this._current = path.resolve(root);
    this.done = done;
    fs.readdir(this._current, gotDir.bind(this));
};

Lsd.prototype._stat = function(item, cb) {
    fs.stat(item, function(err, stats) {
        if (err) {
            this._count -= 1;
            this.emit('error', err);
            this.push(item);
            cb();
        } else {
            if (stats.isDirectory()) {
                this._count -= 1;
                if (this.recurse === true) {
                    this._writeQ.push(item);
                }
                this.emit('directory', item);
                this.push(item);
                cb();
            } else if (stats.isFile()) {
                 this._count -= 1;
                 this.emit('file', item);
                 this.push(item);
                 cb();
           } else {
               this._count -= 1;
               this.emit('notFileorDir', item);
               cb();
           }
        }
    }.bind(this));
};

Lsd.prototype.writeNext = function() {
    var next;
    if (this._writeQ.length === 0) {
        this.end();
        return;
    } else {
        next = this._writeQ.shift();
        this.write(next);
        return;
    }
};

function gotDir(err, contents) {
    var that = this;
    if (err) {
        this.emit('error', err);
        this.writeNext();
        this.done();
    } else {
        this.emit('enter', this._current);
        if (contents.length === 0) {
            this.emit('empty', this._current);
            this.writeNext();
            this.done();
        } else {
            this._count = contents.length;
            contents.forEach(function(file) {
                var fullPath = that._current + path.sep + file;
                that._stat(fullPath, statCB.bind(that));
            });
        }
    }
}

function statCB() {
    if (this._count === 0) {
        this.emit('exit', this._current);
        this.writeNext();
        this.done();
    }
}

// Returns true only if test value is equals true...will return false for anything else
// Example isBool(5) --> false isBool() --> false isBool(isBool(isBool(0))) --> false isBool(true) --> true
function isBool(test) {
    if (test === true) {
        return true;
    } else {
        return false;
    }
}

module.exports = function(opts) {
    return new Lsd(opts);
};

