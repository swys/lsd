var Lsd = require('../lsd.js'),
    lsd = Lsd(),
    test = require('tape'),
    path = require('path');

test('try to write non-directory to lsd', function(t) {
    t.plan(1);
    lsd.write(process.cwd() + path.sep + 'run.js');
    lsd.write(process.cwd());
    lsd.pipe(process.stdout);

    lsd.on('error', function(err) {
        t.ok(err, "We should get an error since we wrote to lsd with a non-directory");
        console.log();
        console.dir(err);
    });

    lsd.on('exit', function(dir) {
        this.writeNext();
    });
    
    lsd.on('end', function() {
        console.log("\nLSD __ENDED__");
    });
});
