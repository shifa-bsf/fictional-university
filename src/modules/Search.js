import axios from "axios"
// import $ from 'jquery';
class Search {
    //initiate objects
    constructor() {
        this.openButton = document.querySelectorAll(".js-search-trigger");
        this.closeButton = document.querySelector(".search-overlay__close");
        this.searchOverlay = document.querySelector(".search-overlay");
        this.searchField = document.querySelector('#search-term');
        this.events();
        this.isOverlayOpen = false;
        this.typingTimer;
        this.resultDiv = document.querySelector('#search-overlay__results');
        this.isSpinnerVisible = false;
        this.previousValue;
    }
    //events
    events() {
        this.openButton.forEach(e => {
            e.addEventListener("click", e => {
                e.preventDefault();
                this.openOverlay();
            })
        });
        this.closeButton.addEventListener("click", () => this.closeOverlay());
        document.addEventListener("keydown", e => this.keyPressDispatcher(e));
        this.searchField.addEventListener("keyup", () => this.typingLogic());
    }
    //methods
    openOverlay() {
        this.searchOverlay.classList.add("search-overlay--active");
        document.body.classList.add("body-no-scroll");
        this.searchField.value = '';
        this.resultDiv.innerHTML='';
        setTimeout(() => this.searchField.focus(), 301)
        this.isOverlayOpen = true;
    }
    closeOverlay() {
        this.searchOverlay.classList.remove("search-overlay--active")
        document.body.classList.remove("body-no-scroll")
        this.isOverlayOpen = false;
    }

    // Open and close search field on key press
    keyPressDispatcher(e) {

        if (e.keyCode === 83 && !this.isOverlayOpen && document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
            this.openOverlay();
        }
        if (e.keyCode === 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    // conditionally show loader on typing 
    typingLogic() {
        if (this.searchField.value != this.previousValue) {
            clearTimeout(this.typingTimer);

            if (this.searchField.value) {
                if (!this.isSpinnerVisible) {
                    this.resultDiv.innerHTML='<div class="spinner-loader"></div>';
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 2000)
            } else {
                this.resultDiv.innerHTML='';
                this.isSpinnerVisible = false;
            }

        }
        this.previousValue = this.searchField.value;
    }

    // show results of search
    async getResults() {
        try {
            // $.when(
            //     $.getJSON(universityData.root_url + "/wp-json/wp/v2/posts?search=" + this.searchField.value),
            //     $.getJSON(universityData.root_url + "/wp-json/wp/v2/pages?search=" + this.searchField.value)
            // ).then(
            //     (posts, pages) => {
            //         var combinedResults = posts[0].concat(pages[0])
            //         this.resultDiv.innerHTML(`
            //       <h2 class="search-overlay__section-title">General Information</h2>
            //       ${combinedResults.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
            //         ${combinedResults.map(item => `
            //             <li><a href="${item.link}">${item.title.rendered}</a> 
            //             ${item.type == "post" ? `by ${item.authorName}` : ""}</li>
            //         `).join("")}
            //       ${combinedResults.length ? "</ul>" : ""}
            //     `)
            //         this.isSpinnerVisible = false
            //     },
            //     () => {
            //         this.resultDiv.innerHTML("<p>Unexpected error; please try again.</p>")
            //     }
            // )

            const response = await axios.get(universityData.root_url + "/wp-json/university/v1/search?term=" + this.searchField.value)
            const results = response.data
            this.resultDiv.innerHTML =`
              <div class="row">
                <div class="one-third">
                  <h2 class="search-overlay__section-title">Blogs</h2>
                  ${results.blog.length ? '<ul class="link-list min-list">' : "<p>No Blogs matches that search.</p>"}
                    ${results.blog.map(item => `<li><a href="${item.link}">${item.title}</a> by ${item.author} </li>`).join("")}
                  ${results.blog.length ? "</ul>" : ""}
                  <h2 class="search-overlay__section-title">Pages</h2>
                  ${results.page.length ? '<ul class="link-list min-list">' : "<p>No pages matches that search.</p>"}
                    ${results.page.map(item => `<li><a href="${item.link}">${item.title}</a> </li>`).join("")}
                  ${results.page.length ? "</ul>" : ""}
                </div>
                <div class="one-third">
                  <h2 class="search-overlay__section-title">Programs</h2>
                  ${results.program.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
                    ${results.program.map(item => `<li><a href="${item.link}">${item.title}</a></li>`).join("")}
                  ${results.program.length ? "</ul>" : ""}
      
                  <h2 class="search-overlay__section-title">Professors</h2>
                  ${results.professor.length ? '<ul class="professor-cards">' : `<p>No professor match that search. </p>`}
                  ${results.professor.map(item => `
                  <li class="professor-card__list-item">
                        <a class="professor-card" href="${item.link}">
                            <img class="professor-card__image" src="${item.image}">
                            <span class="professor-card__name">
                            ${item.title}
                            </span>
                        </a>
                    </li>
                  `).join("")}
                    ${results.professor.length ? "</ul>" : ""}
                </div>
                <div class="one-third">
                  <h2 class="search-overlay__section-title">Events</h2>
                  ${results.event.length ? '<ul class="link-list min-list">' : `<p>No event match that search. <a href="${universityData.root_url}/event">View all event</a></p>`}
                    ${results.event.map(item => `
                    <div class="event-summary">
                        <a class="event-summary__date t-center" href="${item.link}">
                            <span class="event-summary__month">
                            ${item.month}
                            </span>
                            <span class="event-summary__day">
                            ${item.date}
                            </span>
                        </a>
                        <div class="event-summary__content">
                            <h5 class="event-summary__title headline headline--tiny"><a href="${item.link}">
                            ${item.title}
                                </a></h5>
                           
                        </div>
                    </div>
                    `).join("")}
                  ${results.event.length ? "</ul>" : ""}
      
                </div>
              </div>
            `;
            this.isSpinnerVisible = false
        } catch (e) {
            console.log(e)
        }
    }
}

export default Search