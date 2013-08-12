watercolor
==========

A very simple transform stream that outputs text streams to the console with color and style. You can either pipe in a readable stream or write to it directly.

watercolor uses Node's `Streams 2` API to do its dirty work!

install
=======

`npm install watercolor`

example
=======

####Write directly to it :


```
var Watercolor = require('watercolor'),
    watercolor = Watercolor({
        style : 'normal',
        color : 'red'
    });
    
watercolor.write("Hello\n");
watercolor.end("World\n");
watercolor.pipe(process.stdout);
```

The call to `watercolor.write` will output __*Hello*__ in red text with no styling to the console and insert a line break.

The call to `watercolor.end` will output __*World*__ in red text with no styling to the console, insert a line break, and finally end the stream. goodbye!

####Pipe a readable stream to it :
 

```
var Watercolor = require('watercolor'),
    watercolor({
        style : 'underline',
        color : 'yellow'
    }),
    fs = require('fs'),
    readableStream = fs.createReadStream('./path/to/file');

readableStream.pipe(watercolor).pipe(process.stdout);
```

The above code will send all of the contents of `readableStream` into `watercolor` and `watercolor` will output the text to `process.stdout` underlined with yellow text.

usage
=======
I've mainly been using this in my test runner to output a colored Summery report so I can easily see if tests pass/fail by color.
You can hook this into `child_process` `stdout` and `stderr` to get realtime color queues if there are errors occurring with the other node processess you are running.

#####Color seperate `child_process.stdout` and `child_process.stderr`

```
var Watercolor = require('watercolor'),
    errTxt = watercolor({
        color : 'error'
    }),
    successTxt = watercolor({
        color : 'success'
    }),
    spawn = require('child_process').spawn(),
    child = spawn('node', ['myChild.js']);
    
child.process.stderr.write("Something went wrong! I will print in RED\n");
child.process.stdout.write("I\'m just doing what I should be doing, and in GREEN\n");

child.stdout.pipe(successTxt).pipe(process.stdout);
child.stderr.pipe(errTxt).pipe(process.stdout);

child.on('exit', function(exitcode) {
    (exitcode ? errTxt : successTxt).write("Ended with exitcode : " + exitcode);
});
```

The above code will format the child's `stdout` to print `green` text out to the console.

Child's `stderr` will be formatted as `red` text out to the console.

The `exitcode` statement will print either `green` or `red` depending on the outcome.

*Note :*

`success` is mapped to the color green.


`error` is mapped to `red`.


`warn` is mapped to `yellow`.

Another possible use case would be to color seperate I/O from different sources. Like if you have multipe Databases you can color seperate the log output to make it easier to see what is going on with your application.

options
=======

You can initialize watercolor with an options object containing `color` and/or `style`.

#####example

```
var watercolor = require('watercolor'),
    greenText = watercolor({
        color : 'green',
        style : 'underline'
    });

greenText.write("This text will be green and also underlined!\n");
```

##.color() method

This method takes a `string` argument. Simply pass in the color you want to change to.

#####example
`watercolor.color('blue');`

*Note :*

Passing in `'normal'` to this method will set color back to your default text color.

##.style() method

This method takes a `string` argument. Simply pass in the style you want to change to.

#####example
`watercolor.style('underline');`

*Note :*

Passing in `'normal'` to this method will set color back to your default style...which is no style.

##Chainable API

These methods are chainable so you do stuff like :

`watercolor.color('green').style('blink');`

This will change the color to `green` and style to `blink`

`watercolor.color('red');`

This will change the color to `red` and style still be `blink`

`watercolor.color('yellow').style('normal');`

This is change the color to `yellow` and change the style to `normal` or no style.

##available colors

`black` `white` `red` `green` `gray`

`yellow` `blue` `cyan` `magenta`

`normal` `success` `warn` `error`

##available styles

`underline` `blink` `normal`

*Note :*

I realize that there are a few other options such as `bold` or `italic` that I've seen elsewhere but when I tested them on my computer (Mac OSX Lion) they did not work. I didn't want to put anything in here that I could not test myself. If you know of any colors or styles that do work and should be included please feel free to file an issue.

tests
=======

`npm test`

Look in the test directory for some more details

license
=======

MIT
