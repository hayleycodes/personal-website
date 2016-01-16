window.onload = function() {
    console.log("hi");
    var html_tag = document.getElementsByTagName("html")[0];
    var page_url = window.location.href;
    if (page_url.indexOf("about") != -1) {
        html_tag.className = "about-background";
    } else if (page_url.indexOf("projects") != -1) {
        html_tag.className = "projects-background";
    } else if (page_url.indexOf("timeline") != -1) {
        html_tag.className = "timeline-background";
    } else if (page_url.indexOf("contact") != -1) {
        html_tag.className = "contact-background";
    } else {
        html_tag.className = "home-background";
    }
};


jQuery(document).ready(function($){
    var $timeline_block = $(".cd-timeline-block");

    //hide timeline blocks which are outside the viewport
    $timeline_block.each(function(){
        if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
            $(this).find(".cd-timeline-img, .cd-timeline-content").addClass("is-hidden");
        }
    });

    //on scolling, show/animate timeline blocks when enter the viewport
    $(window).on("scroll", function(){
        $timeline_block.each(function(){
            if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find(".cd-timeline-img").hasClass("is-hidden") ) {
                $(this).find(".cd-timeline-img, .cd-timeline-content").removeClass("is-hidden").addClass("bounce-in");
            }
        });
    });
});


