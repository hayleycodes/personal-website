const express = require('express')
const bodyParser = require('body-parser')
const validator = require('email-validator')
const axios = require('axios').default
const moment = require('moment')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
require('dotenv').config()
const app = express()
const CMS_URL =
    process.env.NODE_ENV == 'production'
        ? 'https://hayleyavw-portfolio-site-cms.herokuapp.com/'
        : 'http://localhost:1337/'

app.use(express.static('static'))
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs')

// index page
app.get('/', function(req, res) {
    res.render('pages/index', { env: process.env.NODE_ENV })
})

// blog listing page
app.get('/blog', async (req, res) => {
    let blogPosts = await getBlogPosts()
    blogPosts.data.forEach(blogPost => {
        blogPost.created_at = parseDate(blogPost.created_at)
    })
    res.render('pages/blog', {
        blogPosts: blogPosts.data,
        env: process.env.NODE_ENV
    })
})

// blog post page
app.get('/blog/:blogSlug', async (req, res) => {
    let blogPost = await getBlogPosts(req.params.blogSlug)
    blogPost = blogPost.data[0]
    blogPost.content = parseContent(blogPost.content)
    let jsonld = generateJSON(blogPost)
    blogPost.created_at = parseDate(blogPost.created_at)
    res.render('pages/blogPost', {
        blogPost: blogPost,
        env: process.env.NODE_ENV,
        jsonld: jsonld
    })
})

app.listen(3000, function() {
    console.log('Server running on localhost:3000')
})

function generateJSON(blogPost) {
    let description = blogPost.content.match(/<p>(.*?)<\/p>/)[1]
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'hayley.codes'
        },
        headline: escape(blogPost.title),
        description: escape(description),
        articleBody: escape(blogPost.content),
        image: 'test.com',
        author: {
            '@type': 'Person',
            name: 'Hayley van Waas'
        },
        publisher: {
            '@type': 'Organization',
            name: 'hayley.codes',
            logo: {
                '@type': 'ImageObject',
                url: 'https://hayley.codes/images/favicon.png'
            }
        },
        datePublished: blogPost.created_at,
        dateModified: blogPost.updated_at
    })
}

function parseDate(created_at) {
    let timeStr = moment(created_at)
    return timeStr.utc().format('Do MMM YYYY')
}

function parseContent(mdContent) {
    return md.render(mdContent)
}

async function getBlogPosts(blogSlug) {
    try {
        let url = blogSlug
            ? `${CMS_URL}blog-posts/?slug=${blogSlug}`
            : `${CMS_URL}blog-posts/?_sort=created_at:DESC`
        const response = await axios.get(url)
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
