var spawn = require('child_process').spawn,
    exitCode = 0,
    timeout = 10000,
    fs = require('fs'),
    path = require('path'),
    success = [],
    failed = [],
    Watercolor = require('watercolor'),
    watercolor = Watercolor();

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
            watercolor.color('yellow').style('underline');
            watercolor.write("Summery : \n");
            watercolor.color('green').style('normal');
            watercolor.write("Successful tests : " + success.length + "\n");
            watercolor.color('red');
            watercolor.write("Failed tests : " + failed.length + "\n");
            watercolor.color((exitCode ? 'red' : 'green'));
            watercolor.write("Final Exit Code : " + exitCode + "\n");
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
        watercolor.color('red').style('normal');
        watercolor.write(test + " : timed out\n");
    }, timeout);

    child.on('exit', function(exitcode) {
        clearTimeout(timer);
        console.log(test + " exited with Exit Code : " + exitcode);
        watercolor.color((exitcode ? 'red' : 'green')).style('normal');
        watercolor.write((exitcode ? '✘' : '✔') + ' ' + path.basename(test) + "\n");
        (exitcode ? failed : success).push(test);
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
