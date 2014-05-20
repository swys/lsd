lsd
===

wait what? this isn't that type of program.

Streaming `ls` like module. Write a path into lsd and get back a stream of that directories contents. You will get back a stream of full paths. You can easily hookup a filtering transform stream to alter the output to fit your needs (i.e. strip the paths if you don't need them).

Initialize lsd with `depth` option and then write a path to lsd and get back a stream of the directories contents DEPTH levels deep. Pass `0` to depth option and get back the entire directory tree.

install
=======

```
npm install lsd
```

example
=======

Basic example...

```
var Lsd = require('lsd'),
    lsd = Lsd();

lsd.write(process.cwd());
lsd.pipe(process.stdout);
```

This will simply stream the contents of the current working directory to the console. Pretty basic, just like `ls`.

To make it a little more interesting you could recurse. With just a few lines of code you could traverse your entire hardrive!! I must warn you that extended exposure to the terminal while traversing over, say '/', may cause dizziness. Traverse are your own risk.

###use this code (recurser.js)...

```
var Lsd = require('../lsd.js'),
	lsd = Lsd({depth : process.argv[2] || 0}),
	errs = [];

lsd.pipe(process.stdout);

// catch any EACCES or similar you may find down in the depths of /
lsd.on('error', function(err) {
	errs.push(err);
});

lsd.on('end', function() {
	console.dir(errs);
	console.log("__ENDED__");
});

lsd.write(process.argv[3] || process.cwd());
```

###and run like...

```
node recurser.js 2 /
```

And commense the Recursion!!!!

Hookup some more pipes to filter the output based on your needs.

opts
======

###depth
use like :

```
var Lsd = require('lsd'),
	lsd = Lsd({depth : 2});
```
now when you write a directory to it it will not end until it has gone 2 levels deep from the root.

Pass in a `0` and lsd will stream the entire directory tree.

events
=====

###directory
listen for this event to get directory names as they are found
```
lsd.on('directory', function(dir) {
	// do something cool with directories here
});
```

###file
listen for this event to get file names as the are found
```
lsd.on('file', function(dir) {
	// do something cool with files here
});
```

###notFileorDir
listen for anything that isn't a file or directory. This includes anything else that `fs.stat` can identify. Such as sockets, symlinks, fifo pipes, etc...
```
lsd.on('notFileorDir', function(thing) {
	// you won't know what it is but at least your know its there
});
```

###enter
everytime starts to read a new subdirectory you get an 'enter' event. This event will fire in the `fs.stat` callback right after the `if (err)` check so you'll know if you enter then there was no error reading the directory contents.
```
lsd.on('enter', function(dir) {
	// know when enter a new directory
});
```

###exit
similar to enter but this fires when you are finished with a particular sub-directory
```
lsd.on('exit', function(dir) {
	// I'm now done with this sub-directory
});
```

###contents
This will give you an object containing the sub-directory name and the directorys contents in an array.
```
lsd.on('contents', function(dir) {
	// dir is an object with 2 properties
	// dir is a string giving the full path of the directory name
	// contents is the same array you would get back from using fs.readdir
});
```

###empty
this will tell you that the current directory is empty so you should expect no items
```
lsd.on('empty', function(dir) {
	// fill up an array to keep track of all the empty dirs 
});
```

test
====

run `npm test` and hold on to your seat!

license
=======

MIT
use at your own risk!!!!
