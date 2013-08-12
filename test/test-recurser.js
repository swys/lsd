var Lsd = require('../lsd.js'),
	lsd = Lsd(),
	path = require('path'),
	test = require('tape'),
	fs = require('fs'),
    writes = 0;
    enters = 0,
    empty = 0,
    errors = 0,
    notFileorDir = 0;
    exits = 0,
    ends = 0;

process.title = "recurser";

test('recurse', function(t) {
	t.plan(1);

	lsd.on('error', function(err) {
	    errors += 1;
        console.log("-------------------------------------->");
        console.log("LSD encountered Error!!!!!!!!!!");
        console.log(err);
        if (this._writeQ.length === 0) {
            this.end();
        } else {
            var next = this._writeQ.shift();
            writes += 1;
            this.write(next);
        }
    });

    lsd.on('notFileorDir', function(item) {
        notFileorDir += 1;
        //console.log("Found item that is not a file or directory :", item);
    });

    lsd.on('end', function() {
        ends += 1;
        var writechunk = this._writableState.writechunk,
            allAddsUp = false;
        if (exits + empty + errors + notFileorDir === enters) {
            allAddsUp = true;
        }
        console.log("\n******************************************************************************************");
        console.log("LSD __ENDED__");
        console.log("Writable State Ended ? :", this._writableState.ended);
        console.log("Count : ", this._count);
        console.log("Enters :", enters);
        console.log("Exits : ", exits);
        console.log("Empty Dirs :", empty);
        console.log("Errors :", errors);
        console.log("Item that isn't a file or directory :", notFileorDir);
        console.log("Write Q Length :", this._writeQ.length);
        console.log("Write was called " + writes + " times!!!!");
        console.log("Does it all add up? :", allAddsUp);
        console.log("Ended : " + ends + " times");
        console.log("******************************************************************************************");
        t.equal(allAddsUp, true);
    });

    lsd.on('empty', function(dir) {
        empty += 1;
        //console.log("Empty :", dir);
        if (this._writeQ.length === 0) {
            this.end();
        } else {
            var next = this._writeQ.shift();
            writes += 1;
            this.write(next);
        }   
    });

    lsd.on('enter', function(dir) {
        enters += 1;
        //console.log("Entering :", dir);
    });

    lsd.on('exit', function(dir) {
        exits += 1;
        //console.log("Exiting :", dir);
       if (this._writeQ.length === 0) {
            this.end();
        } else {
            var next = this._writeQ.shift();
            writes += 1;
            this.write(next);
        }
    });

	var rootDir = process.argv[2] || process.cwd();;
    console.log(rootDir);
    lsd.pipe(process.stdout, { end : false });
    writes += 1;
    lsd.write(rootDir);
});


function writeNext() {
    var next;
    if (this._writeQ.length === 0) {
        this.end();
        return;
    } else {
        next = this._writeQ.shift();
        console.log("Next :", next);
        this.write(next);
        return;
    }
}

function afterWrite() {
    var that = this;
    var writechunk = that._transformState.writechunk;
    console.log("********************************************************");
    console.log("Writechunk : ", writechunk);
    console.log("Writable State Ended ? :", that._writableState.ended);
    console.log("Count : ", that._count);
    console.log("Enters :", enters);
    console.log("Exits : ", exits);
    console.log("Write Q Length :", this._writeQ.length);
    console.log("Write was called " + writes + " times!!!!");
    console.log("********************************************************");
}
