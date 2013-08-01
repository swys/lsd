var stream = require('stream'),
    trans = stream.Transform(),
    read = stream.Readable(),
    fs = require('fs'),
    transEnd = 0,
    chunks = [],
    count = 0;


read._read = function() {
    count += 1;
    this.push(count.toString());
    if (count > 5) {
        this.push('four');
        this.push('five');
        this.push('six');
        this.push(null);
    }
};


read.on('end', function() {
    console.log("Read __ENDED__");
});

trans._transform = function(chunk, encoding, done) {
    chunks.push(chunk.toString());
    var data = chunk.toString().toUpperCase();
    this.push(data + "\n");
    done();
};

trans._flush = function() {
    this.push("Hello, your flushing call is ready!!!!!!!!!!\n");
};

trans.on('finish', function() {
    transEnd += 1;
    console.log("TRANSFORM __ENDED__");
    console.log("Transform End Count : " + transEnd);
    console.log(chunks);
    //console.dir(trans);
});

read.pipe(trans).pipe(process.stdout);
