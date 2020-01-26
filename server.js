const express = require('express')
const bodyParser = require('body-parser')
const validator = require('email-validator')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(express.static('static'))
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs')

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/templates/index.html'))
// })

// index page
app.get('/', function(req, res) {
    res.render('pages/index')
})

// app.get('/blog', function(req, res) {
//     console.log(__dirname)
//     res.sendFile(path.join(__dirname + '/templates/blog.html'))
// })

// app.get('/blog/:blogId', function(req, res) {
//     // res.sendFile(path.join(__dirname + '/templates/blogPost.html'))
//     res.send(req.params)
// })

app.listen(3000, function() {
    console.log('Server running on localhost:3000')
})

const apiKey = process.env.API_KEY
const DOMAIN = process.env.API_DOMAIN
let mailgun = require('mailgun-js')({ apiKey: apiKey, domain: DOMAIN })

app.post('/', function(req, res) {
    let email = req.body.email
    if (validator.validate(email) == false) {
        return res.status(400).send()
    }
    let data = {
        from: email,
        to: `${process.env.EMAIL}`,
        subject: 'Message from ' + req.body.name,
        text: req.body.message
    }

    console.log(data)
    mailgun.messages().send(data, function(error, body) {
        console.log(error)
        console.log(body)
    })

    res.status(200).send()
})
