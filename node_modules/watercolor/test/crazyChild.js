var crazyTxt = ["Good People Drink Good Beer", "Sane is boring", "I'm Beautifully Chaotic", "The Grass is Greener where you water it", "Stop the world. I want to get off", "It is dangerous to be right when the government is wrong", "A person needs a little madness, or else they never dare cut the rope and be free", "Reality is always controlled by the people who are most insane", "Being crazy isn\'t enough", "and then I decided I was a Lemon for a couple of weeks", "Where to look if you\'ve lost your mind?", "The reason I talk to myself is because I\'m the only one whose answers I accept", "There is a fine line between genius and insanity. I have erased this line", "I\'ll take crazy over stupid any day", "When you get to the end of your rope. Tie a knot and hang on"];


var times = crazyTxt.length;
var delay = [];
var range = [];
for (var i = 0; i < times; i += 1) {
    delay.push((Math.floor(Math.random() * crazyTxt.length / 2) + 1) * 100);
    range.push(i);
}


delay.forEach(function(val) {
    writer(val, range.pop());
});

function writer(delay, num) {
    setTimeout(function() {
        (num % 2 === 0 ? process.stdout : process.stderr).write(">" + crazyTxt[num] + "\n");
    }, delay);
}

function randUM(arr) {
    var i = arr.length, j, temp;
    if (i === 0) return false;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

