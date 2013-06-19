var DirStream = require('../dirStream.js'),
	pass = require('./passThrough'),
	dirStream = DirStream(),
	path = require('path'),
	test = require('tape'),
	readCount = 0;

var p = pass(process.cwd());

test('directory contents', function(t) {
	t.plan(1);
	dirStream.on('readable', function() {
		readCount += 1;
	});

	dirStream.on('end', function() {
		console.log("\n");
		t.ok(readCount, "Read Count should be a truthy because the contents of the directory where read");
		console.log("\n\ndirStream was readable : " + readCount + " times");
		console.log("That means that this directory should have " + readCount + " items");
	});

	dirStream.on('error', function(err) {
		process.stderr.write(err.toString());
	});

	p.pipe(dirStream).pipe(process.stdout);
});


