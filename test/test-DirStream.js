var Lsd = require('../lsd.js'),
	lsd = Lsd(),
	path = require('path'),
	test = require('tape'),
	readCount = 0;

test('directory contents', function(t) {
	t.plan(1);
	lsd.write(process.cwd());
	lsd.on('readable', function() {
		readCount += 1;
	});

	lsd.on('end', function() {
		console.log("\n");
		t.ok(readCount, "Read Count should be a truthy because the contents of the directory where read");
		console.log("\n\nlsd was readable : " + readCount + " times");
		console.log("That means that this directory should have " + readCount + " items");
	});

	lsd.on('error', function(err) {
		process.stderr.write(err.toString());
	});

	lsd.pipe(process.stdout);
});


