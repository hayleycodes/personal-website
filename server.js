// server.js
// load the things we need
require('dotenv').config()
var express = require('express');
var app = express();
app.use(express.static('static'))

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index', { env: process.env.NODE_ENV })
})

// contact page
app.get('/contact', function(req, res) {
    res.render('pages/contact');
});

app.listen(8080);
console.log('8080 is the magic port');
