import $ from 'jquery';
class Search {
    //initiate objects
    constructor(){
        this.openButton=$(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.events();
        this.isOverlayOpen = false;
    }
    //events
    events(){
        this.openButton.on("click",this.openOverlay.bind(this));
        this.closeButton.on("click",this.closeOverlay.bind(this));
        $(document).on("keyup",this.keyPressDispatcher.bind(this));
    }
    //methods
    openOverlay(){
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.isOverlayOpen = true;
    }
    closeOverlay(){
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }
    keyPressDispatcher(e){
        console.log(e.keyCode);
        if(e.keyCode === 83 && !this.isOverlayOpen){
            this.openOverlay();
        }
        if(e.keyCode === 27 && this.isOverlayOpen){
            this.closeOverlay();
        }
    }
}

export default Search