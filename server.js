const express = require('express')
const bodyParser = require('body-parser')
const validator = require('email-validator')
const axios = require('axios').default
const path = require('path')
require('dotenv').config()

const app = express()
app.use(express.static('static'))
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs')

// index page
app.get('/', function(req, res) {
    res.render('pages/index')
})

app.get('/blog', async (req, res) => {
    let blogPosts = await getBlogPosts()
    res.render('pages/blog', { blogPosts: blogPosts.data })
})

app.get('/blog/:blogId', async (req, res) => {
    let blogPost = await getBlogPost(req.params.blogId)
    res.render('pages/blogPost', { blogPost: blogPost.data })
})

app.listen(3000, function() {
    console.log('Server running on localhost:3000')
})

async function getBlogPosts() {
    try {
        const response = await axios.get('http://localhost:1337/blog-posts')
        console.log(response)
        return response
    } catch (error) {
        console.error(error)
        return
    }
}

async function getBlogPost(blogId) {
    try {
        const response = await axios.get(`http://localhost:1337/blog-posts/${blogId}`)
        console.log(response)
        return response
    } catch (error) {
        console.error(error)
        return
    }
}

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
