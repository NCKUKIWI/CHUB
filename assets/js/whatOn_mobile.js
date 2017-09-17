$(document).ready(function(){

    // 初始化
    switchDisplay("guest");
    switchDisplay("login");
    $(".not_yet").each(function() {
        autoAdjust($(this));
    });
    $(".round_display").each(function() {
        lilGalleryInit($(this));
    });
    gotoPage("whats_on");
    switchBackground("whats_on");
    galleryInit();
    

    // 按鈕監聽
    $( ".button" ).click(function() {
        $(this).addClass("on");
        $(this).siblings(".on").removeClass("on");
    });
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
    


    // Menu 監聽
    $( "#menu_main_btn, .menu_title" ).click(function() {
        if ( $("#menu_content").hasClass("on") ) {
            $("#menu_content").removeClass("on");
        }
        else {
            $("#menu_content").addClass("on");
        }
    });

    // Profile Menu 監聽
    $( "#menu_profile_icon" ).click(function() {
        if ( $(this).hasClass("on") ) {
            switchDisplay('close_profile');
        }
        else {
            switchDisplay('open_profile');
            switchDisplay('close_search');
        }
    });

    // Search Menu 監聽
    $( "#menu_search_icon" ).click(function() {
        if ( $(this).hasClass("on") ) {
            switchDisplay('close_search');
        }
        else {
            switchDisplay('open_search');
            switchDisplay('close_profile');
        }
    });
    
    // 狀態監聽
    $( ".to_logout" ).click(function() {
        switchDisplay("guest");
    });
    $( ".to_login" ).click(function() {
        switchDisplay("member");
    });

    // 分頁監聽
    $( ".switch_signup" ).click(function() {
        gotoPage("signup");
        switchBackground("profile");
    });
    $( ".switch_login" ).click(function() {
        gotoPage("login");
        switchBackground("profile");
    });
    $( ".switch_myprofile" ).click(function() {
        gotoPage("my_profile");
        switchBackground("profile");
    });
    $( ".switch_about" ).click(function() {
        gotoPage("about");
        switchBackground("about");
    });
    $( ".switch_whatson" ).click(function() {
        gotoPage("whats_on");
        switchBackground("whats_on");
    });
      
    // 切換顯示元素
    function switchDisplay(status) {
        if ( status == 'member') {
            $(".loggedin").show();
            $(".loggedout").hide();
        }
        else if ( status == 'guest') {
            $(".loggedout").show();
            $(".loggedin").hide();
        }
        else if ( status == 'open_profile') {
            $("#menu_profile_icon").addClass("on");
            $("#profile_menu").addClass("on");
        }
        else if ( status == 'close_profile') {
            $("#menu_profile_icon").removeClass("on");
            $("#profile_menu").removeClass("on");
        }
        else if ( status == 'open_search') {
            $("#menu_search_icon").addClass("on");
            $("#search_menu").addClass("on");
            // 但現在還沒有 search_menu
        }
        else if ( status == 'close_search') {
            $("#menu_search_icon").removeClass("on");
            $("#search_menu").removeClass("on");
        }
    }

    // 切換顯示背景
    function switchBackground(bg_name) {
        $("#bg_now").removeClass();
        $("#bg_now").addClass("background").addClass(bg_name);
    }

    // 跳轉不同頁面
    function gotoPage ( page_name ) {
        $(".page").hide();
        $("#"+page_name).show();
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

    // 相簿左右切換
    function preGalleryGoto( command ) {
        $("#preview_gallery").find(".move").hide();
        setTimeout( function() {
            $("#preview_gallery").find(".move").show();
        }, 500);
        if ( command == 'next' && $("#preview_gallery").find(".on").next(".dot").length ) {
            var full_width = $(window).width();
            $(".display").css("left","-="+full_width);
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

});