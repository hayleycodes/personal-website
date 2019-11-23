const express = require('express')
const bodyParser = require('body-parser')
const validator = require('email-validator')

const app = express()
app.use(express.static('templates'))
app.use(express.static('static'))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.listen(3000, function() {
    console.log('Server running on localhost:3000')
})

let apiKey = 'key-5f88a965cacbaa9907fc3a2f79083f7a'
let DOMAIN = 'hayleyavw.com'
let mailgun = require('mailgun-js')({ apiKey: apiKey, domain: DOMAIN })

app.post('/', function(req, res) {
    let email = req.body.email
    if (validator.validate(email) == false) {
        return res.status(400).send()
    }
    let data = {
        from: email,
        to: 'contact@hayleyavw.com',
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
