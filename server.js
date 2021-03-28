const express = require('express');
const serveStatic = require('serve-static');
const server = express();

server.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});

server.get('*.css', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
});

server.get('*.webp', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'image/webp');
    next();
});

server.use(serveStatic(__dirname + "/public"));
const port = process.env.PORT || 5000;
server.listen(port);

console.log('server started ' + port);