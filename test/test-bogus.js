var Lsd = require('../lsd.js'),
	lsd = Lsd(),
	path = require('path'),
	test = require('tape');

test('bogus directory', function(t) {
	t.plan(1);

	lsd.write(process.cwd() + path.sep + 'bogus');

	lsd.on('readable', function() {
		console.log("Should never make it here...");
	});

	lsd.on('end', function() {
		console.log("...or here");
	});

	lsd.on('error', function(err) {
		t.ok(err, "This should error out when you pass in a bogus directory");
		process.stdout.write(err.toString());
		console.log("\n");
	});

	lsd.pipe(process.stdout);
});


