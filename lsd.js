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
	Transform.call(this, { encoding : 'utf-8', decodeStrings : false  });
}

Lsd.prototype = Object.create(Transform.prototype, {
	constructor : {
		value : Lsd
	}
});

Lsd.prototype._transform = function(root, encoding, done) {
    var that = this;
    that._current = path.resolve(root);
    fs.readdir(that._current, function(err, contents) {
        if (err) {
			that.emit('error', err);
            that.writeNext();
            done();
        } else {
            that.emit('enter', that._current);
			if (contents.length === 0) {
                that.emit('empty', that._current);
                that.writeNext();
                done();
            } else {
                that._count = contents.length;
				contents.forEach(function(file) {
                    var fullPath = that._current + path.sep + file;
				    that._stat(fullPath, function() {
                        if (that._count === 0) {
                            that.emit('exit', that._current);
                            that.writeNext();
                            done();
                        }   
                    });
                });
            }
		}
	});
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
                if (that.recurse === true) {
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
    if (this._writeQ.length === 0) {
        this.end();
        return;
    } else {
        next = this._writeQ.shift();
        this.write(next);
        return;
    }
}

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

