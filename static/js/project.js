'use strict';


(function() {
    class ProjectDetails extends HTMLElement {
        constructor() {
            super();
            const projectName = this.projectName;
            const projectImg = projectName.toLowerCase().replace(/ /g, "-") + '.png'

            const projectLanguages = this.languages;
            console.log(projectLanguages)

            const template = document.createElement('details')
            template.innerHTML = `
            <style>
                details {
                    margin-bottom: 10px;
                    padding: 10px;
                    background-color: #FFF;
                    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                }
                
                details summary {
                    display: flex;
                    align-items: center;
                }
                
                details summary .summary-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                details img {
                    height: 20px;
                }
            </style>
            
            <summary>
                <div class="summary-content">
                    <img src="images/project-logos/${projectImg}" alt="Logo for ${projectName}">
                    <div id="icons">
                        ${projectLanguages.map(language => `
                            <img src="/images/language-logos/${language}.png">
                        `).join('')}
                    </div>
                </div>
            </summary>
            <p>Further information</p>
            `
            
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(template.cloneNode(true));
        }
            
        get projectName() {
            return this.getAttribute('project-name') || '';
        }

        get languages() {
            const allLanguages = ['html', 'css', 'js', 'ts', 'react', 'python', 'django', 'flask']
            const relatedLanguages = []
            allLanguages.forEach((language) => {
                if (this.getAttribute(language) !== null) {
                    relatedLanguages.push(language)
                }
            })
            return relatedLanguages
        }
   
    }

    customElements.define('project-details', ProjectDetails);

})();

    // // creating a container for the project-details component
    // const projectDetailsContainer = document.createElement('details');

    // // get attribute values from getters

    // const projectName = this.getAttribute('project-name')
    // const projectLogo = `<img src="/images/project-logos/${projectName}.png">`

    // const htmlLogo = this.getAttribute('html-logo') === 'true' ? `<img src="/images/language-logos/html.png">` : '';
    // const cssLogo = this.getAttribute('css-logo') === 'true' ? `<img src="/images/language-logos/css.png">` : '';
    // const jsLogo = this.getAttribute('js-logo') === 'true' ? `<img src="/images/language-logos/js.png">` : '';
    // const tsLogo = this.getAttribute('ts-logo') === 'true' ? `<img src="/images/language-logos/ts.png">` : '';
    // const reactLogo = this.getAttribute('react-logo') === 'true' ? `<img src="/images/language-logos/react.png">` : '';
    // const pythonLogo = this.getAttribute('python-logo') === 'true' ? `<img src="/images/language-logos/python.png">` : '';
    // const djangoLogo = this.getAttribute('django-logo') === 'true' ? `<img src="/images/language-logos/django.png">` : '';
    // const flaskLogo = this.getAttribute('flask-logo') === 'true' ? `<img src="/images/language-logos/flask.png">` : '';

    // adding a class to our container for the sake of clarity
    // projectDetailsContainer.classList.add('project-details-box');

    // creating the inner HTML of the editable list element
    // projectDetailsContainer.innerHTML = ``
