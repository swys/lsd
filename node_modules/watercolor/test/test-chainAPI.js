var Watercolor = require('../watercolor.js'),
    watercolor = Watercolor({color : 'green'});

watercolor.on('error', function(err) {
    console.log("Error :", err);
});

watercolor.write('hello\n');
watercolor.color('red').style('underline');
watercolor.write('world\n');
watercolor.color('yellow').style('normal');
watercolor.write('I\'m Yellow\n');
watercolor.end();
watercolor.pipe(process.stdout);

