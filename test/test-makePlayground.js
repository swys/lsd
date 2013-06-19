var DirStream = require('../dirStream.js'),
	pass = require('./passThrough'),
	dirStream = DirStream(),
	path = require('path'),
	test = require('tape'),
	fs = require('fs'),
	readCount = 0;

test('setup-check-dir-contents', function(t) {
	var playground = process.cwd() + path.sep + 'play',
		i,
		files = [];
	t.plan(5);
	fs.mkdirSync(playground),
	files.push('fun.txt', 'inThe.txt', 'sun.txt');
	for (i = 0; i < 3; i += 1) {
		fs.writeFileSync(playground + path.sep + files[i], new Buffer(Math.floor(Math.random() * 128)));
	}
	t.equal(fs.statSync(playground).isDirectory(), true, "This should be a Directory");
	fs.readdir(playground, function(err, contents) {
		t.notOk(err, "There should not be an error reading directory.");
		contents.forEach(function(file, i) {
			if (files.indexOf(file) !== -1) {
				t.equal(fs.statSync(playground + path.sep + file).isFile(), true, "Should be file");
			}
		});
	});
});

test('check-verify-dir-contents', function(t) {
	var playground = process.cwd() + path.sep + 'play',
		p = pass(playground);

	t.plan(1);

	dirStream.on('readable', function() {
		readCount += 1;
	});

	dirStream.on('end', function() {
		console.log("\n");
		t.equal(readCount, 3, "There should be 3 items in this directory");
		//console.log("\n\ndirStream was readable : " + readCount + " times");
	});

	dirStream.on('error', function(err) {
		process.stderr.write(err.toString());
	});

	p.pipe(dirStream, {end : false}).pipe(process.stdout);

});

test('cleanup', function(t) {
	var playground = process.cwd() + path.sep + 'play',
		contents = fs.readdirSync(playground);

	t.plan(1);

	contents.forEach(function(file) {
		fs.unlinkSync(playground + path.sep + file);
	});
	fs.rmdirSync(playground);
	t.equal(fs.existsSync(playground), false, "This Directory should not exist anymore. Cleanup Complete!!!!");
});


