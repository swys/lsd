var Transform = require('stream').Transform,
	fs = require('fs'),
	path = require('path');

function Lsd() {
	if (!(this instanceof Lsd)) {
		return new Lsd();
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
        that.emit('enter', that._current);
        if (err) {
			that.emit('error', err);
            done();
        } else {
			if (contents.length === 0) {
                that.emit('empty', that._current);
                done();
            } else {
                that._count = contents.length;
				contents.forEach(function(file) {
                    var fullPath = that._current + path.sep + file;
				    that._stat(fullPath, done);
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
        } else {
            if (stats.isDirectory()) {
                that._count -= 1;
                that.emit('directory', item);
                that.push(item);
                that._writeQ.push(item);
            } else if (stats.isFile()) {
                 that._count -= 1;
                 that.emit('file', item);
                 that.push(item);
           } else {
               that._count -= 1;
               that.emit('notFileorDir', item);
           }
        }
        if (that._count === 0) {
           that.emit('exit', path.dirname(item));
           cb();
        }
    });
};

module.exports = function() {
	return new Lsd();
};

