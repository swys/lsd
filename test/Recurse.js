var transform = require('stream').Transform,
	path = require('path'),
	fs = require('fs');

function Recurse() {
	var that = this;
    this._current = null;

	transform.call(that, { encoding : 'utf-8', decodeStrings : false });
}

Recurse.prototype = Object.create(transform.prototype, {
	constructor : {
		value : Recurse
	}
});

Recurse.prototype._transform = function(item, encoding, done) {
	var that = this,
        dir = path.dirname(item);
    console.log("Dir : ", dir);
    console.log("Current : ", that._current);
    if (that._current === null) {
        that._current = dir;
    }
    if (dir !== that._current) {
        that.emit('exit', that._current);
        that._current = dir;
    }
	fs.stat(item, function(err, stats) {
		if (err) {
			that.emit('error', err);
		} else {
			if (stats.isDirectory()) {
				that.emit('directory', item);
				that.push(item.toUpperCase() + "\n");
				done();
			} else if (stats.isFile()) {
				that.emit('file', item);
				that.push("-------> " + item + "\n");
				done();
			}
		}
	});
};

exports.Recurse = Recurse;
