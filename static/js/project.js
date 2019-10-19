'use strict';

(function() {
    class ProjectDetails extends HTMLElement {
        constructor() {
            // establish prototype chain
            super();

            // attaches shadow tree and returns shadow root reference
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
            const shadow = this.attachShadow({ mode: 'open' });

            // creating a container for the project-details component
            const projectDetailsContainer = document.createElement('details');

            // get attribute values from getters
            const title = this.title;
            const listItems = this.items;

            // adding a class to our container for the sake of clarity
            projectDetailsContainer.classList.add('project-details');

            // creating the inner HTML of the editable list element
            projectDetailsContainer.innerHTML = `
            <h3>${title}</h3>
            `;
            
            // appending the container to the shadow DOM
            shadow.appendChild(projectDetailsContainer);
        }
        
        // gathering data from element attributes
        get title() {
            return this.getAttribute('title') || '';
        }

    }



    // let the browser know about the custom element
    customElements.define('project-details', ProjectDetails);

})();
