var path = require('path');

function gotDir(err, contents) {
    var that = this;
    if (err) {
        this.emit('error', err);
        this.writeNext();
        this.done();
    } else {
        this.emit('enter', this._current);
        if (contents.length === 0) {
            this.emit('empty', this._current);
            this.writeNext();
            this.done();
        } else {
            this.emit('contents', {dir : this._current, contents : contents});
            this._count = contents.length;
            contents.forEach(function(file) {
                var fullPath = that._current + path.sep + file;
                that._stat(fullPath, statCB.bind(that));
            });
        }
    }
}

function statCB() {
    if (this._count === 0) {
        this.emit('exit', this._current);
        this.writeNext();
        this.done();
    }
}

// Returns true only if test value is equals true...will return false for anything else
// Example isBool(5) --> false isBool() --> false isBool(isBool(isBool(0))) --> false isBool(true) --> true
function isBool(test) {
    if (test === true) {
        return true;
    } else {
        return false;
    }
}

// Test if input is INT..will return either true of false
function isInt(int) {
    var intRegex = /^\d+$/;
    return intRegex.test(int);
}

module.exports = {
    gotDir : gotDir,
    statCB : statCB,
    isInt : isInt
};