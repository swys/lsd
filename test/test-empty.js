var test = require('tape'),
	fs = require('fs'),
	path = require('path'),
	DirStream = require('../dirStream.js'),
	dirStream = DirStream(),
	pass = require('./passThrough');


test('empty', function(t) {
	var empty = process.cwd() + path.sep + 'empty',
		p = pass(empty),
		contents;

	t.plan(3);

	fs.mkdirSync(empty);
	t.equal(fs.statSync(empty).isDirectory(), true, "Should be a directory");
	contents = fs.readdirSync(empty);
	t.equal(contents.length, 0, "Should be empty");


	dirStream.on('empty', function(dir) {
		console.log("Got empty on : " + dir);
		t.ok(dir, "This is my empty directory");
		cleanup();
	});

	p.pipe(dirStream);
});

function cleanup() {
	test('cleanup-my-mess', function(t) {
		var empty = process.cwd() + path.sep + 'empty';

		t.plan(1);

		fs.rmdirSync(empty);
		t.equal(fs.existsSync(empty), false, "Should be deleted");
	});
}