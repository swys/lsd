var Transform = require('stream').Transform,
	fs = require('fs'),
	path = require('path'),
	util = require('util');

function DirStream() {
	if (!(this instanceof DirStream)) {
		return new DirStream();
	}

	Transform.call(this, {encoding : 'utf-8', decodeStrings : false});
}

DirStream.prototype = Object.create(Transform.prototype, {
	constructor : {
		value : DirStream
	}
});

DirStream.prototype._transform = function(root, encoding, done) {
	var that = this;
	fs.readdir(path.resolve(root), function(err, contents) {
		if (err) {
			err.root = that.root;
			that.emit('error', err);
		} else {
			if (contents.length === 0) {
				that.emit('empty', root);
			} else {
				contents.forEach(function(file) {
					that.push(file);
				});
				that.end();
			}
		}
	});
};

DirStream.prototype.end = function() {
	var that = this;
	that.emit('end');
};

//DirStream.prototype.

module.exports = function() {
	return new DirStream();
};

