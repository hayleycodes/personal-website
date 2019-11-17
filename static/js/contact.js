// Contact Form
var non_empty = true

// Open when someone clicks on the span element
function openContact() {
    document.getElementById('contact-overlay').style.height = '100%'
    document.getElementById('name').focus()
}

// Close when someone clicks on the "x" symbol inside the overlay
function closeContact() {
    document.getElementById('contact-overlay').style.height = '0%'
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
        non_empty = false
    } else {
        element.style.borderColor = '#ccc'
    }
}

// email function
function sendEmail() {
    var name_element = document.getElementById('name')
    var email_element = document.getElementById('email')
    var message_element = document.getElementById('message')

    var name = document.getElementById('name').value
    var email = document.getElementById('email').value
    var message = document.getElementById('message').value

    // if no value then give red highlight
    highlightEmpty(name_element)
    highlightEmpty(email_element)
    highlightEmpty(message_element)

    if (non_empty == true) {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // everything is fine - show validation message
                console.log('all is well')
                var overlay_message = document.getElementById('overlay')
                overlay_message.classList.toggle('show')
                name_element.value = ''
                email_element.value = ''
                message_element.value = ''
                setTimeout(() => {
                    overlay_message.classList.toggle('show')
                }, 2000)
            } else if (xhr.readyState == 4 && xhr.status == 400) {
                email_element.style.borderColor = 'red'
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
