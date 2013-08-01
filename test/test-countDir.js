var Lsd = require('../lsd.js'),
    lsd = Lsd(),
    tran = require('stream').Transform(),
    path = require('path'),
    test = require('tape'),
    fs = require('fs');
    count = 0;

test('count-dir-items', function(t) {
    var dirContents = fs.readdirSync(process.cwd()).length;
    t.plan(1);
    tran._transform = function(chunk, encoding, done) {
        this.push(chunk + "\n");
        count += 1;
        done();
    };

    lsd.on('end', function() {
        console.log("Count is : " + count)
        t.equal(count, dirContents);
    });


    lsd.pipe(tran).pipe(process.stdout);

    lsd.write(path.resolve(process.cwd()));
    lsd.end();
});
