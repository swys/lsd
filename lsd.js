var Transform = require('stream').Transform,
    fs = require('fs'),
    path = require('path'),
    depthcharge = require('depthcharge'),
    helper = require('./helper.js');

function Lsd(opts) {
    if (!(this instanceof Lsd)) {
        return new Lsd(opts);
    }
    if (opts && helper.isInt(opts.depth)) {
        this.depth = Number(opts.depth);
    } else {
        this.depth = -1;
    }
    this._root = null;
    this._level = 0;
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
    this._root = (this._root === null ? this._current : this._root);
    this.done = done;
    fs.readdir(this._current, helper.gotDir.bind(this));
};

Lsd.prototype._stat = function(item, cb) {
    var that = this;
    fs.stat(item, function(err, stats) {
        if (err) {
            that._count -= 1;
            that.emit('error', err);
            that.push(item);
            cb();
        } else {
            if (stats.isDirectory()) {
                that._count -= 1;
                if (that.depth === 0 || depthcharge(that._root, that._current) < that.depth) {
                    that._writeQ.push(item);
                }
                that.emit('directory', item);
                that.push(item);
                cb();
            } else if (stats.isFile()) {
                 that._count -= 1;
                 that.emit('file', item);
                 that.push(item);
                 cb();
           } else {
               that._count -= 1;
               that.emit('notFileorDir', item);
               cb();
           }
        }
    });
};

Lsd.prototype.writeNext = function() {
    var next;
    if (this._writeQ.length === 0 || this.depth === -1) {
        this.end();
        return;
    } else {
        next = this._writeQ.shift();
        this.write(next);
        return;
    }
};

module.exports = function(opts) {
    return new Lsd(opts);
};

