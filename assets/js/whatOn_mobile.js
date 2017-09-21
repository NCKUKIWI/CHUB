$(document).ready(function(){

    // 初始化
    // switchDisplay("guest");
    // switchDisplay("login");

    $(".not_yet").each(function() {
        autoAdjust($(this));
    });
    $(".round_display").each(function() {
        lilGalleryInit($(this));
    });

    galleryInit();
    

    // 按鈕監聽
    // $( ".button" ).click(function() {
    //     $(this).addClass("on");
    //     $(this).siblings(".on").removeClass("on");
    // });
    $( ".move.right" ).click(function() {
        preGalleryGoto("next");
    });
    $( ".move.left" ).click(function() {
        preGalleryGoto("prev");
    });
    $( ".go_to.next" ).click(function() {
        var name = $(this).parents(".block").attr("id").replace("block_","");
        lilGalleryGoto( name, "next");
    });
    $( ".go_to.prev" ).click(function() {
        var name = $(this).parents(".block").attr("id").replace("block_","");
        lilGalleryGoto( name, "prev");
    });
    $( ".sort_way.hot" ).click( function() {
        $(this).siblings(".sort_way").removeClass("now");
        $(this).addClass("now");
    });
    $( ".sort_way.time" ).click( function() {
        $(this).siblings(".sort_way").removeClass("now");
        $(this).addClass("now");
    });
});

$(window).on('load', function() {
  $(".not_yet").each(function() {
      autoAdjust($(this));
  })
})

$(window).on('resize', function() {
	window.location.href="/" // 暫時只要橫放，就重load網頁
})

// 相簿左右切換
function preGalleryGoto( command ) {
    $("#preview_gallery").find(".move").hide();
    setTimeout( function() {
        $("#preview_gallery").find(".move").show();
    }, 500);
    if ( command == 'next' && $("#preview_gallery").find(".on").next(".dot").length ) {
        var full_width = $(window).width();
        $(".display").css("left","-="+full_width);
        $(".info").text = $("#preview_gallery").find(".on")[0].getAttribute("name");
        $("#preview_gallery").find(".on").removeClass("on").next(".dot").addClass("on");
    }
    else if ( command == 'prev' && $("#preview_gallery").find(".on").prev(".dot").length ) {
        var full_width = $(window).width();
        $(".display").css("left","+="+full_width);
        $("#preview_gallery").find(".on").removeClass("on").prev(".dot").addClass("on");
    }
    checkifMoveable();
}

// 相簿到底隱藏按鈕
function checkifMoveable() {
    if ( $("#preview_gallery").find(".on").next(".dot").length ) {
        $( ".move.right" ).removeClass("disabled");
    }
    else {
        $( ".move.right" ).addClass("disabled");
    }
    if ( $("#preview_gallery").find(".on").prev(".dot").length ) {
        $( ".move.left" ).removeClass("disabled");
    }
    else {
        $( ".move.left" ).addClass("disabled");
    }
}

// 相簿初始化（寬度調整、點點數量）
function galleryInit() {
    var photo_num = ($("#preview_gallery").find(".pic_full").length );
    var full_width = $(window).width();
    $( ".display" ).css( "width" , "+=" + full_width*photo_num );
    for ( i = 1 ; i < photo_num ; i ++ ) {
        $("#preview_gallery").find(".counter").append('<div class="dot"></div>');
    }
    checkifMoveable();
}

// 小相簿左右切換
function lilGalleryGoto( name, command ) {
    if ( command == 'next' && $("#display_"+name).find(".on").next(".display_item").length) {
        var move_width = $(window).width()*0.65;
        $("#display_"+name).css("left","-="+move_width);
        $("#display_"+name).find(".on").removeClass("on").next(".display_item").addClass("on");
        $( ".go_to.next" ).off();
        setTimeout( function() {
            $( ".go_to.next" ).click(function() {
                var name = $(this).parents(".block").attr("id").replace("block_","");
                lilGalleryGoto( name, "next");
            });
        }, 500);
    }
    else if ( command == 'prev' && $("#display_"+name).find(".on").prev(".display_item").length ) {
        var move_width = $(window).width()*0.65;
        $("#display_"+name).css("left","+="+move_width);
        $("#display_"+name).find(".on").removeClass("on").prev(".display_item").addClass("on");
        $( ".go_to.prev" ).off();
        setTimeout( function() {
            $( ".go_to.prev" ).click(function() {
                var name = $(this).parents(".block").attr("id").replace("block_","");
                lilGalleryGoto( name, "prev");
            });
        }, 500);
    }
}

// 小相簿初始化
function lilGalleryInit( gallery ) {
    var photo_num = (gallery.find(".display_item").length );
    var move_width = $(window).width()*0.6;
    gallery.css( "width" , "+=" + move_width*photo_num );
}

// 自動調整圖片大小
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