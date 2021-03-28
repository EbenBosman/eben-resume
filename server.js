const express = require('express');
const expressStaticGzip = require("express-static-gzip");
const serveStatic = require('serve-static');
const server = express();

server.use('/public/assets', expressStaticGzip('public/assets', {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders: (res, path) => res.setHeader("Cache-Control", "public, max-age=31536000")
}));

server.use(serveStatic(__dirname + "/public"));
const port = process.env.PORT || 5000;
server.listen(port);

console.log('server started ' + port);