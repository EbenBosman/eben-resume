const express = require('express');
const serveStatic = require('serve-static');
const server = express();

const setContentEncoding = (req, res) => {
    if (req.header("Accept-Encoding").indexOf('br') !== -1) {
        req.url = req.url + '.br';
        res.set('Content-Encoding', 'br');
    } else {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
    }
}

server.get('*.js', function (req, res, next) {
    setContentEncoding(req, res);
    res.set('Content-Type', 'text/javascript');
    next();
});

server.get('*.css', function (req, res, next) {
    setContentEncoding(req, res);
    res.set('Content-Type', 'text/css');
    next();
});

server.get('*.webp', function (req, res, next) {
    setContentEncoding(req, res);
    res.set('Content-Type', 'image/webp');
    next();
});

server.use(serveStatic(__dirname + "/public"));
const port = process.env.PORT || 5000;
server.listen(port);

console.log('server started ' + port);