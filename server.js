const express = require('express');
const serveStatic = require('serve-static');
const server = express();
server.use(serveStatic(__dirname + "/public"));
const port = process.env.PORT || 5000;
server.listen(port);
console.log('server started '+ port);