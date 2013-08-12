var options = {
        color : 'success',
        style : 'normal'
    },
    Watercolor = require('../watercolor.js'),
    watercolor = Watercolor(options),
    fs = require('fs'),
    test = require('tape'),
    stream = require('stream'),
    pass = stream.PassThrough({ encoding : 'utf-8'}),
    times = 0,
    colorz = require('../colors.js'),
    colorKey = ['yellow', 'gray', 'magenta'],
    styleKey = ['normal', 'normal', 'normal'];


test('verify color values are being written', function(t) {    
    t.plan(3);
    pass.on('readable', function() {
        var chunk = this.read(),
            data = chunk.toString().split('\n');
        t.equal(data[0].toString().substr(0, 5), colorz.colors[colorKey[times]] + colorz.styles[styleKey[times]]);
        times += 1;
        process.stdout.write(chunk);
    });

    watercolor.color('yellow');
    watercolor.write('hello\n');
    watercolor.color('gray');
    watercolor.write('world\n');
    watercolor.color('magenta');
    watercolor.write('GOODBYE!!!!\n');

    watercolor.pipe(pass);
});
