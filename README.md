lsd
===

Streaming `ls` like module. Write a path into lsd and get back a stream of that directories contents. 

Initialize lsd with `depth` option and then write a path lsd and get back a stream of the directories contents DEPTH levels deep. Pass `0` to depth option and get back the entire directory tree.

example
=======

```
var Lsd = require('../lsd.js'),
    lsd = Lsd();

lsd.write(process.cwd());
lsd.pipe(process.stdout);
```

