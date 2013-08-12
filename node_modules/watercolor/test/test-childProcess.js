var Watercolor = require('../watercolor.js'),
    errTxt = Watercolor({
        color : 'error'
    }),
    successTxt = Watercolor({
        color : 'success'
    }),
    spawn = require('child_process').spawn,
    path = require('path'),
    runPath = (path.basename(process.cwd()) === 'test' ? '' : 'test/'),i
    child = spawn('node', [runPath + 'crazyChild.js']),
    stream = require('stream'),
    redPass = stream.PassThrough({ encoding : 'utf-8'}),
    colorz = require('../colors.js'),
    red = colorz.colors['red'],
    test = require('tape'),
    pattern = /^[^>]*>/;

test('color seperate child process stdout & stderr', function(t) {
    child.stdout.pipe(successTxt).pipe(process.stdout);
    child.stderr.pipe(errTxt).pipe(redPass);

    redPass.on('readable', function() {
        var chunk = this.read(),
            data = pattern.exec(chunk.toString()),
            str;
        if (data === null) {
            console.log("The bloody data equal NULL!!!!");
            return;
        }
        str = data[0].substr(0, data[0].length - 1);
        t.equal(str, red);
        process.stdout.write(chunk);
    });
    redPass.on('end', function() {
        t.end();
        console.log("__ENDED__");
        console.log("Note : Only the values on the child stderr were checked in tests");
    });
});
