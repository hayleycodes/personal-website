async function getBlogPosts() {
    let response = await fetch(`http://localhost:1337/blog-posts${}`)
    let data = await response.json()
    return data
}

window.onload = async () => {
    let posts
    await getBlogPosts().then(data => (posts = data))
    posts.forEach(post => {
        let newParagraph = document.createElement('p')
        let text = document.createTextNode(post.title)
        newParagraph.appendChild(text)
        document.getElementById('content').appendChild(newParagraph)
    })
    const md = window.markdownit()
    let result = md.render(posts[0].content)
    let newParagraph = document.createElement('div')
    newParagraph.innerHTML = result
    document.getElementById('content').appendChild(newParagraph)
}
