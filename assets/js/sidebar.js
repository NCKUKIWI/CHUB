$(document).ready(function(){

    // Initialize
    
    var now_tab = "none", now_open = 0;
    $( "#side_cont_login, #side_cont_signup, #side_cont_search, .profile_before_btn, .search_btn, .sidebar_cover" ).hide();

    
    // Tab Listener

    $( "#side_profile" ).click(function() {
        if ( now_tab == "profile" ) {
            switchSidebar("close");
        }
        else {
            button_logIn();
            now_tab = "profile";
            switchSidebar("open");
            setTimeout(function(){
                $( "#side_profile" ).addClass("active");
            },200);
        }
    });

    $( "#side_message" ).click(function() {
        if ( now_tab == "message" ) {
            switchSidebar("close");
        }
        else {
            now_tab = "message";
            switchSidebar("open");
            setTimeout(function(){
                $( "#side_message" ).addClass("active");
            },200);
        }
    });

    $( "#side_search" ).click(function() {
        if ( now_tab == "search" ) {
            switchSidebar("close");
        }
        else {
            search();
            now_tab = "search";
            switchSidebar("open");
            setTimeout(function(){
                $( "#side_search" ).addClass("active");
            },200);
        }
    });

    $( ".sidebar_cover" ).click(function() {
        switchSidebar("close");
    }); 


    // Button Listener

    $( "#sidebar_signup, #dont_have_account" ).click(function() {
        button_signUp();
    });

    $( "#sidebar_login" ).click(function() {
        button_logIn();
    });

    $( ".dropdown-content" ).click(function() {
        if ($(this).hasClass("opened")) {
            $(this).removeClass("opened");
        }
        else {
            $(this).addClass("opened");
            $(this).siblings().removeClass("opened");
        }
    });

    $( ".selectable" ).click(function() {
        selectItem($(this));
    });
    

    // login按鈕按下送出
    $("#loginSubmit").on("click", function() {
      if($("#side_cont_login input[name=userid]").val() != "") {
        $.ajax({
          url: "/users/auth",
          type: "POST",
          data: $("#side_cont_login").serialize(),
          success: function(response) {
            if(response == "ok") {
              window.location.href = "/";
            } else {
              toastr.error(response["error"]);
            }
          }
        });
      }
    });

    // signup 按鈕按下送出
    $("#signupSubmit").on("click", function() {
      $.ajax({
        url: "/users/signup",
        type: "POST",
        data: $("#side_cont_signup").serialize(),
        success: function(response) {
          if(response == "ok") {
            window.location.href = "/";
          } else {
            for(var i in response["error"]) {
              toastr.error(`<p>${response["error"][i]}</p>`);
              // $("#signupForm .errormsg").append(`<p>${response["error"][i]}</p>`);
            }
          }
        }
      });
    });

    // 綁定按下enter = 送出資料
    $(document).keypress(function(e) {
        // if(e.which == 13 && $('#msgText').val() != "") {
        //     sendMessage();
        // }

        if ($('.sidebar_cont').css('opacity') == 0) return; // 如果沒打開側邊欄，就不啟動功能

        if(e.which == 13 && $('#side_cont_login').css('display') == "block"){
            $('#loginSubmit').trigger('click');
        }

        if(e.which == 13 && $('#side_cont_signup').css('display') == "block"){
            $('#signupSubmit').trigger('click');
        }
    });

    // Functions

    function switchSidebar( command ) {
        $( ".side_icon" ).removeClass("active");
        if ( command == "open" ) {
            now_open = 1;
            $( ".sidebar_cont, .sidebar_cover" ).show();
            $( ".sidebar_cont" ).css({'right':'94px','opacity':'0.95'});
        }
        if ( command == "close" ) {
            now_open = 0;
            now_tab = "none";
            $( ".sidebar_cont" ).css({'right':'60px','opacity':'0'});
            setTimeout(function(){
                $( ".sidebar_cont, .sidebar_cover" ).hide();
            }, 700 );
        };
    }

    function button_signUp() {
        $( "#sidebar_signup" ).addClass("active");
        $( "#sidebar_login" ).removeClass("active");
        $( "#side_cont_login, #side_cont_search, .search_btn" ).fadeOut( 200, function(){
             $( "#side_cont_signup, .profile_before_btn, .triangle" ).fadeIn();
        });
        $( ".triangle" ).css({'left':'70%'});
    }

    function button_logIn() {
        $( "#sidebar_login" ).addClass("active");
        $( "#sidebar_signup" ).removeClass("active");
        $( "#side_cont_signup, #side_cont_search, .search_btn" ).fadeOut( 200, function(){
             $( "#side_cont_login, .profile_before_btn, .triangle" ).fadeIn();
        });
        $( ".triangle" ).css({'left':'20%'});
    }

    function search() {
        $( "#sidebar_login, #sidebar_signup" ).removeClass("active");
        $( "#side_cont_login, #side_cont_signup, .profile_before_btn, .triangle" ).fadeOut( 200, function(){
             $( "#side_cont_search, .search_btn" ).fadeIn();
        });
    }

    function selectItem(item) {
        var selected = item.text();
        item.siblings(".default").text(selected);
        item.siblings(".hidden").removeClass("hidden");
        item.addClass("hidden");
    }

});
