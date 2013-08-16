var Lsd = require('../lsd.js'),
    lsd = Lsd();

lsd.write(process.cwd());
lsd.pipe(process.stdout);
