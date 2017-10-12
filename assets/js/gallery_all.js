$(document).ready(function(){

    // var swiper = new Swiper('.swiper-container', {
        // pagination: '.swiper-pagination',
        // slidesPerView: 1,
        // centeredSlides: true,
        // paginationClickable: true,
        // spaceBetween: 30,
        // loop: false,
        // nextButton: '.swiper-button-next',
        // prevButton: '.swiper-button-prev'
    // });

    $("#close_gallery").click( function() {
        $(".float_pic_window").fadeOut();
    });

});

// $(window).on("load", function () {

//     $(".not_yet").each(function () {
//         autoAdjust($(this));
//     });

// });

// function autoAdjust(outer_div) {
//     var inner_pic_size = outer_div.children("img").css("width").replace("px", "") / outer_div.children("img").css("height").replace("px", "");
//     var outer_div_size = outer_div.css("width").replace("px", "") / outer_div.css("height").replace("px", "");
//     if (inner_pic_size > outer_div_size) {
//         outer_div.addClass("fat");
//         outer_div.removeClass("not_yet");
//     }
//     else if (inner_pic_size <= outer_div_size) {
//         outer_div.addClass("tall");
//         outer_div.removeClass("not_yet");
//     }
// }