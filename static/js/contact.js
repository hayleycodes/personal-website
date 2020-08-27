// Contact Form
let empty = false
const formElement = document.getElementById('contact-form')
const nameElement = document.getElementById('name')
const emailElement = document.getElementById('email')
const messageElement = document.getElementById('message')
const sendButtonElement = document.getElementById('send-email-button')
const confirmation = document.getElementById('form-confirmation')
const text = document.getElementById('contact-message')

// form colouring
function highlightEmpty(element) {
    if (element.value == '') {
        element.parentElement.classList.add('empty')
        empty = true
    } else {
        element.parentElement.classList.remove('empty')
        empty = false
    }
}

// email function
function sendEmail() {
    let name = nameElement.value
    let email = emailElement.value
    let message = messageElement.value

    // if no value then show message
    highlightEmpty(nameElement)
    highlightEmpty(emailElement)
    highlightEmpty(messageElement)

    if (!empty) {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', '/', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // everything is fine - show validation message
                console.log('all is well')
                text.classList.toggle('hide')
                formElement.classList.toggle('hide')
                confirmation.classList.toggle('hide')
            } else if (xhr.readyState == 4 && xhr.status == 400) {
                // invalid email - show error
                emailElement.parentElement.classList.add('empty')
                console.log('400')
            } else if (xhr.readyState == 4) {
                console.log('panic!')
            }
        }
        xhr.send(
            JSON.stringify({
                name,
                email,
                message
            })
        )
    }
}
