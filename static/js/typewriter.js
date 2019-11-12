// Typewriter effect for subtitle
'use strict';
document.addEventListener("DOMContentLoaded", function (event) {
    const dataText = ["Mentor.", "Workshop Leader.", "Developer."];

    const flashCursor = async () => {
        document.querySelector("h2").classList.toggle("show-cursor");
    }

    function highlight() {
        document.querySelector("h2").classList.toggle('highlight');
    }

    // type one text in the typwriter
    // keeps calling itself until the text is finished
    async function typeWriter(text, i, fnCallback) {
        if (i < (text.length)) {
            document.querySelector("h2").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 100);
        }
        else if (typeof fnCallback == 'function') {
            for (var i = 0; i < 6; i++) {
                await new Promise(done => setTimeout(() => {
                    flashCursor();
                    done()
                }, 500));
            }
            document.querySelector("h2").classList.toggle('highlight');
            await new Promise(done => setTimeout(() => {
                highlight();
                done()
            }, 1000));
            setTimeout(fnCallback, 0);
        }
    }
    // start a typewriter animation for a text in the dataText array
    function StartTextAnimation(i) {
        if (i >= dataText.length) {
            setTimeout(function () {
                StartTextAnimation(0);
            }, 20000);
        } else {
            if (i < dataText[i].length) {
                typeWriter(dataText[i], 0, function () {
                    // after callback (and whole text has been animated), start next text
                    StartTextAnimation(i + 1);
                });
            }
        }
    }

    StartTextAnimation(0);
});