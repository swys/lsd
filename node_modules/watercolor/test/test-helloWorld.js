var Watercolor = require('../watercolor.js'),
    watercolor = Watercolor({
        style : 'normal',
        color : 'red'
    }),
    test = require('tape'),
    stream = require('stream'),
    passThrough = stream.PassThrough({ encoding : 'utf-8'}),
    testCount = 0,
    values = ["Hello\n", "World\n"],
    colorz = require('../colors.js'),
    colorVal = colorz.colors['red'],
    resetVal = colorz.reset;

test('simple write to stream', function(t) {
    t.plan(2);
    watercolor.write("Hello\n");
    watercolor.end("World\n");
    watercolor.pipe(passThrough);

    passThrough.on('readable', function() {
        var chunk = passThrough.read();
        t.equal(chunk, colorVal + values[testCount] + resetVal);
        testCount += 1;
        process.stdout.write(chunk);
    });
});
