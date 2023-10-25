const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const server = express();
const pdfTemplate = require('./server/resume-template');

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

dotenv.config();

server.post('/message', (req, res) => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const formattedEmail = `You have a new message from: <strong>${req.body.email}</strong><br><br>The original message is:<br><br>${req.body.message.replace(/(\r\n|\n|\r)/g,"<br />")}`;

    const msg = {
        to: process.env.MAILBOX_TO_MONITOR,
        from: 'no-reply@ebenbosman.com',
        subject: 'Message from ebenbosman.com',
        text: req.body.message,
        html: formattedEmail
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
            res.status(200).end("Email sent");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).end("Message not sent")
        });        
});

server.post('/pdf-resume', (req, res) => {
    pdfTemplate(res);
});

server.get('/pdf-resume', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})

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

// issue: https://developer.chrome.com/blog/enabling-shared-array-buffer/
server.use((req, res, next) => {
    res.set('Cross-Origin-Embedder-Policy', 'credentialless');
    res.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.set('Cache-control', 'public, max-age=31536000');

    next();
});

server.use(serveStatic(__dirname + "/public"));

server.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
})

const port = process.env.PORT || 5000;
server.listen(port);

console.log('server started ' + port);