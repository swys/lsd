var transform = require('stream').Transform,
	path = require('path'),
	fs = require('fs');

function Recurse() {
	var that = this;

	transform.call(that, { encoding : 'utf-8', decodeStrings : false });
}

Recurse.prototype = Object.create(transform.prototype, {
	constructor : {
		value : Recurse
	}
});

Recurse.prototype._transform = function(item, encoding, done) {
	var that = this;

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