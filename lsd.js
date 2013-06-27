var Transform = require('stream').Transform,
	fs = require('fs'),
	path = require('path'),
	util = require('util');

function Lsd() {
	if (!(this instanceof Lsd)) {
		return new Lsd();
	}

	Transform.call(this, { encoding : 'utf-8', decodeStrings : false });
}

Lsd.prototype = Object.create(Transform.prototype, {
	constructor : {
		value : Lsd
	}
});

Lsd.prototype._transform = function(root, encoding, done) {
	var that = this;
	that.dir = path.resolve(root);
	fs.readdir(that.dir, function(err, contents) {
		if (err) {
			that.emit('error', err);
		} else {
			if (contents.length === 0) {
				that.emit('empty', that.dir);
				done();
				that.emit('end');
			} else {
				contents.forEach(function(file) {
					that.push(that.dir + path.sep + file);
				});
				done();
				that.emit('end');
			}
		}
	});
};


module.exports = function() {
	return new Lsd();
};

