// Contact Form
let empty = false
let tabIndex = '-1'
const closeButtonElement = document.getElementById('close-button')
const nameElement = document.getElementById('name')
const emailElement = document.getElementById('email')
const messageElement = document.getElementById('message')
const sendButtonElement = document.getElementById('send-email-button')

function openContact() {
    document.getElementById('contact-overlay').style.height = '100%'
    toggleTabIndexes()
}

function toggleTabIndexes() {
    tabIndex = tabIndex == -1 ? 0 : -1
    closeButtonElement.tabIndex = tabIndex
    nameElement.tabIndex = tabIndex
    emailElement.tabIndex = tabIndex
    messageElement.tabIndex = tabIndex
    sendButtonElement.tabIndex = tabIndex
}

function closeContact() {
    document.getElementById('contact-overlay').style.height = '0%'

    const formElements = document.getElementsByClassName('form-element')
    for (var i = 0; i < formElements.length; i++) {
        formElements[i].classList.remove('empty')
    }

    toggleTabIndexes()
}

// close contact on escape key
function keydownHandler(e) {
    if (e.keyCode === 27) {
        closeContact()
    }
    if (document.activeElement.id === 'email-button' && e.keyCode === 13) {
        // enter key
        openContact()
    }
}

// register handler method for the keydown event
document.addEventListener('keydown', keydownHandler, false)

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
                let overlayMessage = document.getElementById('message-confirmation-overlay')
                overlayMessage.classList.toggle('show')
                setTimeout(() => {
                    overlayMessage.classList.toggle('show')
                    closeContact()
                    nameElement.value = ''
                    emailElement.value = ''
                    messageElement.value = ''
                }, 3000)
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
