var Lsd = require('../lsd.js'),
	lsd = Lsd(),
	path = require('path'),
	test = require('tape'),
	fs = require('fs'),
	readCount = 0,
	Recurse = require('./Recurse.js').Recurse,
	recurser = new Recurse();

process.title = "recurser";

test('recurse', function(t) {
	fs.mkdirSync('./hello');
	t.plan(1);
	lsd.write(process.cwd());
	lsd.on('readable', function() {
		readCount += 1;
	});

	lsd.on('error', function(err) {
		process.stderr.write(err.toString());
	});

	lsd.on('empty', function(dir) {
		console.log("This is empty : " + dir);
		if (dir === path.resolve('./hello')) {
			fs.rmdirSync('./hello');
		}
	});

	recurser.on('directory', function(dir) {
		lsd.write(dir);
	});

	recurser.on('file', function(file) {
		//t.ok(file, "File events mean data is flowing");
	});

	recurser.on('error', function(err) {
		process.stderr.write(err.toString());
	});

	recurser.on('end', function() {
		console.log("Recurser emitted end!!!!!!!");
	});

	lsd.pipe(recurser, { end : false }).pipe(process.stdout, { end : false });
	t.pass(readCount + "means we are getting data");
});


