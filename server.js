const express = require('express');
const serveStatic = require('serve-static');
const server = express();
server.use(serveStatic(__dirname + "/public"));
const port = process.env.PORT || 5000;
server.listen(port);

server.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
})

console.log('server started ' + port);