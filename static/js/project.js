'use strict'
;(function() {
    class ProjectDetails extends HTMLElement {
        constructor() {
            super()
            const projectName = this.projectName
            const projectImg =
                projectName
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/'/g, '') + '.png'
            const projectLanguages = this.languages
            const jobTitle = this.jobTitle
            const startDate = this.startDate
            const endDate = this.endDate
            const duration = this.duration

            const template = document.createElement('details')
            template.innerHTML = `
            <style>
            </style>
            
            <summary>
                <div class="summary-wrapper">
                    <div class="summary-row-1">
                        <img class="project-logo" src="images/project-logos/${projectImg}" alt="Logo for ${projectName}">
                        <div class="icons">
                            ${projectLanguages
                                .map(
                                    language => `
                                        <div class="tooltip">
                                            <img src="/images/language-logos/${language}.png" alt="${language} logo">
                                            <span class="tooltip-text">${language}</span>
                                        </div>
                                    `
                                )
                                .join('')}
                        </div>
                    </div>
                    <div class="summary-row-2">
                        <h5>${jobTitle}</h5>
                        <h5>
                            ${startDate ? (endDate ? startDate + ' - ' + endDate : startDate) : ''}
                             ${duration !== '' ? '(' + duration + ')' : ''}
                        </h5>
                    </div>
                </div>
                <div class="summary-chevron-up">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline class="chevron" points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </summary>
            <slot class="description" name="project-description"></slot>
            `

            const shadow = this.attachShadow({ mode: 'open' })

            // apply stylesheet
            const linkElem = document.createElement('link')
            linkElem.setAttribute('rel', 'stylesheet')
            linkElem.setAttribute('href', 'stylesheets/base.css')

            shadow.appendChild(linkElem)
            shadow.appendChild(template.cloneNode(true))
        }

        get projectName() {
            return this.getAttribute('project-name') || ''
        }

        get jobTitle() {
            return this.getAttribute('job-title') || ''
        }

        get startDate() {
            return this.getAttribute('start-date') || ''
        }

        get endDate() {
            return this.getAttribute('end-date') || ''
        }

        get duration() {
            return this.getAttribute('duration') || ''
        }

        get languages() {
            const allLanguages = [
                'HTML',
                'CSS',
                'Bootstrap',
                'JavaScript',
                'TypeScript',
                'threejs',
                'React',
                'Emotion',
                'Python',
                'Django',
                'Flask',
                'Tornado'
            ]
            const relatedLanguages = []
            allLanguages.forEach(language => {
                if (this.getAttribute(language) !== null) {
                    relatedLanguages.push(language)
                }
            })
            return relatedLanguages
        }
    }

    customElements.define('project-details', ProjectDetails)
})()
