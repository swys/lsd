var stream = require('stream'),
	source = stream.PassThrough;
	path = require('path');

function pass(root) {
	if (!(this instanceof pass)) {
		return new pass(root);
	}
	source.call(this, {encoding : 'utf-8', decodeStrings : false });
	this.root = path.resolve(root);
	this._write(this.root);
}

pass.prototype = Object.create(source.prototype, {
	constructor : {
		value : pass
	}
});

pass.prototype._write = function(chunk, encoding, done) {
	var that = this;
	that.push(chunk);
	that.end();
};

pass.prototype.end = function() {
	// no op
};

module.exports = function(root) {
	return pass(root);
};