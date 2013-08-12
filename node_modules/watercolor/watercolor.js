var Transform = require('stream').Transform,
    codes = require('./colors.js');

function Watercolor(opts) {
    if (!(this instanceof Watercolor)) {
        return new Watercolor(opts);
    }
    if (opts) {
        this._color = codes.colors[opts.color] || '';
        this._style = codes.styles[opts.style] || '';
    } else {
        this._color = '';
        this._style = '';
    }
    Transform.call(this, { encoding : 'utf-8' });
}

Watercolor.prototype = Object.create(Transform.prototype, {
    constructor : {
        value : Watercolor
    }
});

Watercolor.prototype._transform = function(chunk, encoding, next) { 
    this.push(this._color + this._style + chunk + codes.reset);
    next();
};

Watercolor.prototype.color = function(setcolor) {
    if (isValid.call(this, codes.colors, 'color', setcolor)) {
        this._color = codes.colors[setcolor];
        return this;
    } else {
        return this;
    }
};

Watercolor.prototype.style = function(setstyle) {
    if (isValid.call(this, codes.styles, 'style', setstyle)) {
        this._style = codes.styles[setstyle];
        return this;
    } else {
        return this;
    }
};

module.exports = function(opts) {
        return new Watercolor(opts);
};

function isValid(codeType, setter, arg) {
    if (arg === 'normal') {
        return true;
    }
    if (typeof arg !== 'string') {
        this.emit('error', "Invalid arguments! You must pass a string to this function");
        return false;
    }       
    if (!codeType[arg]) {
        this.emit('error', arg + " not found! Pass in a valid " + setter);
        return false;
    }
    return true;
}


