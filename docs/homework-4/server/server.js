const express = require('express');

/* routes */
const status = require('./routes/status');
const api = require('./routes/api');

const port = 8000;

const app = express();

/* disable CORS, delete in production :) */
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    return next();
});

/* parse json requests */
app.use(express.json());

app.post('/status', status);
app.post('/api*', api);

/* 404 */
app.use(function (req, res, next) {
    res.status(404).end('<h1>Page not found</h1>');
});

/* server error */
app.use(function (err, req, res, next) {
    res.status(500).end('Server error');
});

app.listen(port, function() {
    console.log(`server is running at ${port} port`);
    app.set('startTime', new Date())
});
