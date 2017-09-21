$(document).ready(function(){
  // 初始化
  switchDisplay("guest");
  switchDisplay("login");

  // 按鈕監聽
  $( ".button" ).click(function() {
      $(this).addClass("on");
      $(this).siblings(".on").removeClass("on");
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
      $("#main").hide();
      $("#"+page_name).show();
  }

})