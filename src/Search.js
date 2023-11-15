import $ from 'jquery';
class Search {
    //initiate objects
    constructor() {
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $('#search-term');
        this.events();
        this.isOverlayOpen = false;
        this.typingTimer;
        this.resultDiv = $('#search-overlay__results');
        this.isSpinnerVisible = false;
        this.previousValue;
    }
    //events
    events() {
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keydown", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));
    }
    //methods
    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.searchField.val('');
        this.resultDiv.html('');
        setTimeout(() => this.searchField.trigger('focus'), 300);
        this.isOverlayOpen = true;
    }
    closeOverlay() {
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }

    // Open and close search field on key press
    keyPressDispatcher(e) {

        if (e.keyCode === 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
            this.openOverlay();
        }
        if (e.keyCode === 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    // conditionally show loader on typing 
    typingLogic() {
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.typingTimer);

            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                    this.resultDiv.html('<div class="spinner-loader"></div>')
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 2000)
            } else {
                this.resultDiv.html('');
                this.isSpinnerVisible = false;
            }

        }
        this.previousValue = this.searchField.val();
    }

    // show results of search
    getResults() {
        $.when(
            $.getJSON(universityData.root_url + "/wp-json/wp/v2/posts?search=" + this.searchField.val()),
            $.getJSON(universityData.root_url + "/wp-json/wp/v2/pages?search=" + this.searchField.val())
        ).then(
            (posts, pages) => {
                var combinedResults = posts[0].concat(pages[0])
                this.resultDiv.html(`
              <h2 class="search-overlay__section-title">General Information</h2>
              ${combinedResults.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
                ${combinedResults.map(item => `
                    <li><a href="${item.link}">${item.title.rendered}</a> 
                    ${item.type == "post" ? `by ${item.authorName}` : ""}</li>
                `).join("")}
              ${combinedResults.length ? "</ul>" : ""}
            `)
                this.isSpinnerVisible = false
            },
            () => {
                this.resultDiv.html("<p>Unexpected error; please try again.</p>")
            }
        )


    }
}

export default Search