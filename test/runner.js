#!/usr/bin/env node
var fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn,
	tTimeout = 10000,
	failed = [],
	success = [];

function runTest(test, cb) {
	var child = spawn(process.execPath, [ path.join(__dirname, test) ]),
		stdout = '',
		stderr = '',
		killTimeout;

	child.stdout.on('data', function(chunk) {
		//console.log(chunk.toString());
		stdout += chunk;
	});

	child.stderr.on('data', function(chunk) {
		console.log("should never be here!!!!!!!!!!!!!!!!");
		stderr += chunk;
		child.kill();
	});

	child.on('error', function(err) {
		console.log("log those errors");
	});

	killTimeout = setTimeout(function() {
		child.kill();
		console.log(' ' + path.basename(test) + ' timed out');
		cb();
	}, tTimeout);

	child.on('exit', function(exitCode) {
		clearTimeout(killTimeout);
		console.log("Exit Code is : " + exitCode);
		console.log(' ' + (exitCode ? '✘' : '✔') + ' ' + path.basename(test));
		(exitCode ? failed : success).push(test);
		if (exitCode) {
			console.log('stdout :');
			process.stdout.write(stdout);

			console.log('stderr :');
			process.stdout.write(stderr);
		}
		cb();
	});
}

function runTests(tests) {
	var index = 0;
	console.log("Running Tests :");

	function next() {
		if (index === tests.length - 1) {
			console.log();
			console.log("Summery :");
			console.log(' ' + success.length + '\tpassed tests');
			console.log(' ' + failed.length + '\tfailed tests');
			process.exit(failed.length);
		}
		runTest(tests[++index], next);
	}
	runTest(tests[0], next);
}

runTests(fs.readdirSync(__dirname).filter(function(test) {
	return test.substr(0, 5) === 'test-';
}));

process.stderr.on('data', function(chunk) {
	console.log("pump data");
	console.log(chunk);
});