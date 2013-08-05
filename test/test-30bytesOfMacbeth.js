var Lsd = require('../lsd.js'),
	lsd = Lsd(),
	path = require('path'),
	test = require('tape'),
	fs = require('fs'),
	readCount = 0;

test('write first 30 kilobytes of Macbeth, seperated into 3 files', function(t) {
	var playground = process.cwd() + path.sep + 'play',
		i,
		j,
		files = [],
		readStream,
		writeStream,
		filesWritten = 0,
		macbeth;
		start = 0,
		end = 9999;
	switch (path.basename(process.cwd())) {
		case 'lsd' :
			macbeth = './test/macbeth.txt';
			break;
		case 'test' :
			macbeth = './macbeth.txt';
			break;
		default :
			throw new Error("You must run this test from either the /lsd/ dir the /lsd/test dir");
	}
	console.log("Macbeth : " + macbeth);
	t.plan(7);
	fs.mkdirSync(playground),
	files.push('Enter.txt', 'Three.txt', 'Witches.txt');
	// Write 3 files from 1 source
	// Each file is written with the next 9999 consecutive bytes from the source stream
	for (i = 0; i < files.length; i += 1) {
		readStream = fs.createReadStream(macbeth, { start : start, end : end });
		writeStream = fs.createWriteStream(playground + path.sep + files[i]);
		console.log("About to write to : " + files[i]);
		readStream.pipe(writeStream);
		start += 10000;
		end += 10000;
	}

	readStream.on('open', function() {
		console.log("read Stream opened");
		t.pass("We are reading from the file");
	});

	readStream.on('close', function() {
		console.log("Reading closed on file");
		// Call close since we are done reading
		writeStream.close();
	});

	writeStream.on('open', function() {
		console.log("write stream opened");
		t.pass("We are writing to the files");
	});

	writeStream.on('error', function(err) {
		console.log("write Stream got error : " + err);
	});

	writeStream.on('close', function() {
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
});

test('verify contents with lsd', function(t) {
	var playground = process.cwd() + path.sep + 'play';

	t.plan(1);

	lsd.write(playground);

	lsd.on('readable', function() {
		var read;
        while (read = lsd.read()) {
            console.log("Read :", read);
            readCount += 1;
        }
        this.end();
	});

	lsd.on('end', function() {
		console.log("\n");
		t.equal(readCount, 3, "There should be 3 items in this directory");
		console.log("\n\nlsd was readable : " + readCount + " times");
	});

	lsd.on('error', function(err) {
		process.stderr.write(err.toString());
	});

	lsd.pipe(process.stdout);

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


