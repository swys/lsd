var Lsd = require('../lsd.js'),
	lsd = Lsd({depth : process.argv[2] || 0}),
	dp = require('depthcharge'),
	test = require('tape'),
	fs = require('fs'),
	path = require('path'),
	rmdir = require('rmdir'),
	watercolor = require('watercolor'),
	depth1Color = watercolor({
		color : 'cyan'
	}),
	depth2Color = watercolor({
		color : 'cyan'
	}),
	depth3Color = watercolor({
		color : 'cyan'
	}),
	depth0Color = watercolor({
		color : 'cyan'
	}),
	dir = process.argv[3] || process.cwd();


test('make test directories and files', function(t) {
	var count = 0,
		depth1,
		depth2,
		depth3;
	fs.mkdirSync(process.cwd() + path.sep + 'depth-test-one');
	fs.mkdirSync(process.cwd() + path.sep + 'depth-test-one' + path.sep + 'depth-test-two');
	fs.mkdirSync(process.cwd() + path.sep + 'depth-test-one' + path.sep + 'depth-test-two' + path.sep + 'depth-test-three');
	depth1 = fs.createWriteStream(process.cwd() + path.sep + 'depth-test-one/depth1.txt', {flags : 'w'});
	depth2 = fs.createWriteStream(process.cwd() + path.sep + 'depth-test-one/depth-test-two/depth2.txt', {flags : 'w'});
	depth3 = fs.createWriteStream(process.cwd() + path.sep + 'depth-test-one/depth-test-two/depth-test-three/depth3.txt', {flags : 'w'});

	t.plan(1);
	depth1.write('depth1', function() {
		depth1.end();
	});

	depth1.on('finish', function() {
		console.log("__DEPTH1 ENDED__");
		count += 1;
		depth2.write('depth2\n', function() {
			depth2.end();
		});
	});
	depth2.on('finish', function() {
		console.log("__DEPTH2 ENDED__");
		count += 1;
		depth3.write('depth3\n', function() {
			depth3.end();
		});
	});
	depth3.on('finish', function() {
		console.log("__DEPTH3 ENDED__");
		count += 1;
		t.equal(count, 3);
	});

});

test('test depth argument with 3 different values', function(t) {
	var oneDeep = Lsd({depth : 1}),
		twoDeep = Lsd({depth : 2}),
		threeDeep = Lsd({depth : 3}),
		zeroDeep = Lsd({depth : 0}),
		baseDir = process.cwd();
		colorShift = ['cyan', 'magenta', 'yellow', 'blue', 'green', 'white', 'gray'],
		maxColor = colorShift.length - 1,
		nextColor = 0,
		first = true,
		colorChanges = 0,
		colorCount = {
			Depth1 : {
				colors : []
			},
			Depth2 : {
				colors : []
			},
			Depth3 : {
				colors : []
			},
			Depth0 : {
				colors : []
			}
		};

	oneDeep.on('end', function() {
		nextColor = 0;
		console.log("__ONE DEEP ENDED__");
		t.equal(colorCount['Depth1'].colors.length, colorChanges);
		colorChanges = 0;
		first = true;
		twoDeep.write(baseDir);
	});
	oneDeep.on('contents', function(dir) {
		(first === true ? first = false : (nextColor >= maxColor ? nextColor = 0 : nextColor += 1));
		console.log(dir.dir + " has " + dir.contents.length + " items");
		colorCount['Depth1'].colors.push(colorShift[nextColor]);
		colorChanges += 1;
		depth1Color.color(colorShift[nextColor]);
	});
	twoDeep.on('end', function() {
		nextColor = 0;
		console.log("__TWO DEEP ENDED__");
		t.equal(colorCount['Depth2'].colors.length, colorChanges);
		colorChanges = 0;
		first = true;
		threeDeep.write(baseDir);
	});
	twoDeep.on('contents', function(dir) {
		(first === true ? first = false : (nextColor >= maxColor ? nextColor = 0 : nextColor += 1));
		console.log(dir.dir + " has " + dir.contents.length + " items");
		colorCount['Depth2'].colors.push(colorShift[nextColor]);
		colorChanges += 1;
		depth2Color.color(colorShift[nextColor]);
	});
	threeDeep.on('end', function() {
		nextColor = 0;
		console.log("__THREE DEEP ENDED__");
		t.equal(colorCount['Depth3'].colors.length, colorChanges);
		colorChanges = 0;
		first = true;
		zeroDeep.write(baseDir);
	});
	threeDeep.on('contents', function(dir) {
		(first === true ? first = false : (nextColor >= maxColor ? nextColor = 0 : nextColor += 1));
		console.log(dir.dir + " has " + dir.contents.length + " items");
		colorCount['Depth3'].colors.push(colorShift[nextColor]);
		colorChanges += 1;
		depth3Color.color(colorShift[nextColor]);
	});

	zeroDeep.on('end', function() {
		nextColor = 0;
		console.log("__ZERO DEEP ENDED__");
		t.equal(colorCount['Depth0'].colors.length, colorChanges);
		colorChanges = 0;
		t.end();
	});
	zeroDeep.on('contents', function(dir) {
		(first === true ? first = false : (nextColor >= maxColor ? nextColor = 0 : nextColor += 1));
		console.log(dir.dir + " has " + dir.contents.length + " items");
		colorCount['Depth0'].colors.push(colorShift[nextColor]);
		colorChanges += 1;
		depth0Color.color(colorShift[nextColor]);
	});

	oneDeep.pipe(depth1Color).pipe(process.stdout);
	twoDeep.pipe(depth2Color).pipe(process.stdout);
	threeDeep.pipe(depth3Color).pipe(process.stdout);
	zeroDeep.pipe(depth0Color).pipe(process.stdout);

	oneDeep.write(baseDir);
});

test('clean up our mess', function(t) {
	var target = process.cwd() + path.sep + 'depth-test-one';

	rmdir(target, rmdirCB);

	function rmdirCB(err, dirs, files) {
		if (err) {
			console.error(err);
		} else {
			console.log("Removed these directories : ");
			console.dir(dirs);
			console.log("Removed these files : ");
			console.dir(files);
			t.equal(fs.existsSync(target), false);
			t.end();
		}
	}
});
