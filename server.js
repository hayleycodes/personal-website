const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios').default
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
// const CMS_URL =
//     process.env.NODE_ENV == 'production'
//         ? 'https://hayleyavw-portfolio-site-cms.herokuapp.com/'
//         : 'http://localhost:1337/'
const CMS_URL = 'https://hayleyavw-portfolio-site-cms.herokuapp.com/'
require('dotenv').config()
var app = express()
app.use(express.static('static'))
app.use(bodyParser.json())

// set the view engine to ejs
app.set('view engine', 'ejs')

// index page
app.get('/', function(req, res) {
    res.render('pages/index', { env: process.env.NODE_ENV })
})

app.get('/web-and-software-development', function(req, res) {
    res.render('pages/development', { env: process.env.NODE_ENV })
})

app.get('/instructional-design', function(req, res) {
    res.render('pages/instructionalDesign', { env: process.env.NODE_ENV })
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

// contact page
app.get('/contact', function(req, res) {
    res.render('pages/contact', { env: process.env.NODE_ENV })
})

app.listen(8080)
console.log('8080 is the magic port')

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
    return new Date(created_at).toLocaleString('default', { year: 'numeric', month: 'long' })
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
