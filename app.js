const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const path = require('path');
const EventHandler = require('./EventHandler');

// middlewares
app.use(express.static('public'));
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup evironment
app.set('EventHandler', EventHandler);

// api
app.use('/api', require('./routes')(EventHandler));

// default page (SPA)
app.all('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '/views/404.html'));
});

// error handler
app.use(function (err, req, res, next) {
    if (res.headersSent)
        return next(err);

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: (app.get('env') === 'development' || app.get('env') === 'dev') ? err : {}
    });
});

module.exports = app;