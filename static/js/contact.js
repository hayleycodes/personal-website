// Contact Form
let nonEmpty = true
const nameElement = document.getElementById('name')
const emailElement = document.getElementById('email')
const messageElement = document.getElementById('message')

// Open when someone clicks on the span element
function openContact() {
    document.getElementById('contact-overlay').style.height = '100%'
    // document.getElementById('name').focus()
}

// Close when someone clicks on the "x" symbol inside the overlay
function closeContact() {
    document.getElementById('contact-overlay').style.height = '0%'
    nameElement.disabled = false
    emailElement.disabled = false
    messageElement.disabled = false

    const formElements = document.getElementsByClassName('form-element')
    for (var i = 0; i < formElements.length; i++) {
        formElements[i].classList.remove('disabled')
    }
}

// Disable the form inputs
function disableForm() {
    nameElement.disabled = true
    emailElement.disabled = true
    messageElement.disabled = true

    const formElements = document.getElementsByClassName('form-element')
    for (var i = 0; i < formElements.length; i++) {
        formElements[i].classList.add('disabled')
    }
}

// close contact on escape key
function keydownHandler(e) {
    if (e.keyCode == 27) {
        document.getElementById('contact-overlay').style.height = '0%'
    }
    if (e.keyCode == 13) {
        openContact()
    }
}

// register handler method for the keydown event
document.addEventListener('keydown', keydownHandler, false)
document.getElementById('email-button').addEventListener('keydown', keydownHandler)

// form colouring
function highlightEmpty(element) {
    if (element.value == '') {
        element.style.borderColor = 'red'
        nonEmpty = false
    } else {
        element.style.borderColor = '#ccc'
    }
}

// email function
function sendEmail() {
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let message = document.getElementById('message').value

    // if no value then give red highlight
    highlightEmpty(nameElement)
    highlightEmpty(emailElement)
    highlightEmpty(messageElement)

    if (nonEmpty == true) {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', '/', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = function() {
            // disableForm()
            if (xhr.readyState == 4 && xhr.status == 200) {
                // everything is fine - show validation message
                console.log('all is well')
                nameElement.value = ''
                emailElement.value = ''
                messageElement.value = ''
                let overlayMessage = document.getElementById('message-confirmation-overlay')
                overlayMessage.classList.toggle('show')
                setTimeout(() => {
                    overlayMessage.classList.toggle('show')
                    closeContact()
                }, 3000)
            } else if (xhr.readyState == 4 && xhr.status == 400) {
                emailElement.style.borderColor = 'red'
                // invalid email - show error
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
