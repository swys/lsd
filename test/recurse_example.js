var Lsd = require('../lsd.js'),
	lsd = Lsd({depth : process.argv[2] || 0}),
	errs = [];

lsd.pipe(process.stdout);

lsd.on('error', function(err) {
	errs.push(err);
});

lsd.on('end', function() {
	console.dir(errs);
	console.log("__ENDED__");
});

lsd.write(process.argv[3] || process.cwd());