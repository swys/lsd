var test = require('tape'),
	fs = require('fs'),
	path = require('path'),
	Lsd = require('../lsd.js'),
	lsd = Lsd();


test('empty', function(t) {
	var empty = process.cwd() + path.sep + 'empty',
		contents;

	t.plan(3);

	try {
    fs.mkdirSync(empty);
    } catch(e) {}
	t.equal(fs.statSync(empty).isDirectory(), true, "Should be a directory");
	contents = fs.readdirSync(empty);
	t.equal(contents.length, 0, "Should be empty");

	lsd.on('empty', function(dir) {
		console.log("Got empty on : " + dir);
		t.ok(dir, "This is my empty directory");
		cleanup();
	});

    lsd.on('enter', function(dir) {
        console.log("Entered Dir : ", dir);
    });

    lsd.write(empty);

});

function cleanup() {
	test('cleanup-my-mess', function(t) {
		var empty = process.cwd() + path.sep + 'empty';

		t.plan(1);

		fs.rmdirSync(empty);
		t.equal(fs.existsSync(empty), false, "Should be deleted");
	});
}
