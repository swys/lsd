console.dir = require('cdir');

var test = {
    one : 1,
    two : 2,
    three : 3,
    four : 4,
    five : {
        'five-one' : 5.1,
        'five-two' : 5.2,
        'five-three' : 5.3,
        'five-four' : 5.4
    }
};

console.dir(test);
