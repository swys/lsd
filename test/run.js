var spawn = require('child_process').spawn,
    exitCode = 0,
    timeout = 10000,
    fs = require('fs'),
    path = require('path'),
    success = [],
    failed = [],
    Watercolor = require('../../watercolor/watercolor.js'),
    failTest = { color : 'error' },
    passTest = { color : 'success' },
    watercolor = Watercolor(passTest);

watercolor.on('error', function(err) {
    console.log("Watercolor error!!!!");
    console.dir(err);
});

watercolor.pipe(process.stdout);

function testQ(tests) {
    var index = 0;
    function next() {
        if (index === tests.length - 1) {
            console.log();
            watercolor.setOpts({color : 'yellow'});
            watercolor.write("Summery : ");
            watercolor.setOpts(passTest);
            watercolor.write("Successful tests : " + success.length);
            watercolor.setOpts(failTest);
            watercolor.write("Failed tests : " + failed.length);
            watercolor.setOpts((exitCode ? failTest : passTest));
            watercolor.write("Final Exit Code : " + exitCode);
        } else {
            index += 1;
            runTest(tests[index], next);
        }
    }

    
    runTest(tests[index], next);
}

function runTest(test, cb) {
    var test = __dirname + path.sep + test,
        child = spawn('node', [test]),
        timer;

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stdout);

    timer = setTimeout(function() {
        child.kill();
        console.log(test + " : timed out");
    }, timeout);

    child.on('exit', function(exitcode) {
        clearTimeout(timer);
        console.log(test + " exited with Exit Code : " + exitcode);
        watercolor.setOpts((exitCode ? failTest : passTest));
        watercolor.write((exitCode ? '✘' : '✔') + ' ' + path.basename(test));
        (exitCode ? failed : success).push(test);
        cb();
    });
}


fs.readdir(__dirname + path.sep, function(err, contents) {
    if (err) {
        throw new Error("Error Reading Directory :", err);
    } else {
        testQ(contents.filter(function(test) {
                return test.substr(0, 5) === 'test-';
        }));
    }
});
