'use strict';


(function() {
    class ProjectDetails extends HTMLElement {
        constructor() {
            super();
            const projectName = this.projectName;
            const projectImg = projectName.toLowerCase().replace(/ /g, "-").replace(/'/g, "") + '.png'
            const projectLanguages = this.languages;
            const jobTitle = this.jobTitle;

            const template = document.createElement('details')
            template.innerHTML = `
            <style>
                details {
                    font-family: 'Roboto', sans-serif;
                    margin-bottom: 10px;
                    padding: 10px;
                    background-color: #FFF;
                    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                }
                
                details summary {
                    display: flex;
                    align-items: center;
                }

                details summary .summary-wrapper {
                    width: 100%;
                }
                
                .summary-row-1, .summary-row-2 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                details img {
                    height: 20px;
                }
                
                h4 {
                    margin: 3px 0 0 0;
                    color: #3E3E3E;
                    font-size: 0.8rem;
                }
                
            </style>
            
            <summary>
                <div class="summary-wrapper">
                    <div class="summary-row-1">
                        <img src="images/project-logos/${projectImg}" alt="Logo for ${projectName}">
                        <div class="icons">
                            ${projectLanguages.map(language => `
                                <img src="/images/language-logos/${language}.png">
                            `).join('')}
                        </div>
                    </div>
                    <div class="summary-row-2">
                        <h4>${jobTitle}</h4>
                        <h4>16/12/18 - 16/12/18 (8 months)</h4>
                    </div>
                </div>
            </summary>
            <slot class="description" name="project-description"></slot>
            `
            
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(template.cloneNode(true));
        }
            
        get projectName() {
            return this.getAttribute('project-name') || '';
        }

        get jobTitle() {
            return this.getAttribute('job-title') || '';
        }

        get languages() {
            const allLanguages = ['html', 'css', 'js', 'ts', 'threejs', 'react', 'python', 'django', 'flask', 'tornado']
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
