$(document).ready(function(){ 
    // 
});

$(window).on( "load", function () {

    // 初始化
    galleryInit();
    preGalleryGoto("next");
    preGalleryGoto("prev");
    $(".not_yet").each(function() {
        autoAdjust($(this));
    });
    animationPlay( $("#start_img") );

    // 按鈕監聽
    $( ".move.right" ).click(function() {
        preGalleryGoto("next");
    });
    $( ".move.left" ).click(function() {
        preGalleryGoto("prev");
    });
    $( ".sort_way.hot" ).click( function() {
        $(this).siblings(".sort_way").removeClass("now");
        $(this).addClass("now");
    });
    $( ".sort_way.time" ).click( function() {
        $(this).siblings(".sort_way").removeClass("now");
        $(this).addClass("now");
    });

    // Fullpage 相關
    $( "#fullpage" ).fullpage();
    // $( ".no_autoscroll" ).hover(
    //     function() {
    //         $.fn.fullpage.setAutoScrolling(false);
    //     }, function() {
    //         $.fn.fullpage.setAutoScrolling(true);
    //     }
    // );

});

function autoAdjust( outer_div ) {
    var inner_pic_size = outer_div.children("img").css("width").replace("px","") / outer_div.children("img").css("height").replace("px","") ;
    var outer_div_size = outer_div.css("width").replace("px","") / outer_div.css("height").replace("px","") ;
    if ( inner_pic_size > outer_div_size ) {
        outer_div.addClass("fat");
        outer_div.removeClass("not_yet");
    }
    else if ( inner_pic_size <= outer_div_size ) {
        outer_div.addClass("tall");
        outer_div.removeClass("not_yet");
    }
}

function galleryInit() {
    var photo_num = $("#news_list").find(".pic_full").length ;
    var full_width = $(window).width()*0.85;
    $( ".display" ).css( "width" , "+=" + full_width*photo_num*1.1 );
    for ( i = 1 ; i < photo_num ; i ++ ) {
        $("#news_list").find(".counter").append('<div class="dot"></div>');
    }
    checkifMoveable();
}

function preGalleryGoto( command ) {
    $("#news_list").find(".move").hide();
    setTimeout( function() {
        $("#news_list").find(".move").show();
    }, 500);
    if ( command == 'next' && $("#news_list").find(".on").next(".dot").length ) {
        var full_width = $(".pic_full").width() ;
        $(".display").css("left","-="+full_width);
        $("#news_list").find(".on").removeClass("on").next(".dot").addClass("on");
    }
    else if ( command == 'prev' && $("#news_list").find(".on").prev(".dot").length ) {
        var full_width = $(".pic_full").width() ;
        $(".display").css("left","+="+full_width);
        $("#news_list").find(".on").removeClass("on").prev(".dot").addClass("on");
    }
    checkifMoveable();
}

function checkifMoveable() {
    if ( $("#news_list").find(".on").next(".dot").length ) {
        $( ".move.right" ).removeClass("disabled");
    }
    else {
        $( ".move.right" ).addClass("disabled");
    }
    if ( $("#news_list").find(".on").prev(".dot").length ) {
        $( ".move.left" ).removeClass("disabled");
    }
    else {
        $( ".move.left" ).addClass("disabled");
    }
}

function autoAdjust( outer_div ) {
    var inner_pic_size = outer_div.children("img").css("width").replace("px","") / outer_div.children("img").css("height").replace("px","") ;
    var outer_div_size = outer_div.css("width").replace("px","") / outer_div.css("height").replace("px","") ;
    if ( inner_pic_size > outer_div_size ) {
        outer_div.addClass("fat");
        outer_div.removeClass("not_yet");
    }
    else if ( inner_pic_size <= outer_div_size ) {
        outer_div.addClass("tall");
        outer_div.removeClass("not_yet");
    }
}

function animationPlay( start_img ) {        
    var next_img = start_img.next(".invisible");
    if ( next_img.length ) {
        if ( next_img.attr('id') == "final" ) {
            next_img.addClass("visible").addClass("animated").addClass("bounce").removeClass("invisible");
        }
        else {
            next_img.addClass("visible").removeClass("invisible");
        }
        setTimeout ( function() {
            animationPlay ( next_img );
        }, 1000);
    }
    else ;
}