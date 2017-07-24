// $(document).ready(function(){

// 	// Initialize
	
// 	var now_tab = "none", now_page = "none", sidebar_open = 0, halfscreen_open = 0,
// 	<% if(me) {%>
// 		var login_status = 1;
// 	<% }else{ %>
// 		var login_status = 0;
// 	<% } %> 
// 	$( ".sidebar_cont, .side_cont_page, .side_menu, .sidebar_cover, .side_halfscreen" ).hide();

	
// 	// Tab Listener

// 	$( "#side_profile" ).click(function() {
// 		if ( now_tab == "profile" ) {
// 			switchSidebar("close");
// 		}
// 		else {
// 			if ( now_page == "login" ) {
// 				logIn();
// 			}
// 			else if ( now_page == "sign_up" ) {
// 				signUp();
// 			}
// 			else if ( now_page == "my_profile" ) {
// 				myProfile();
// 			}
// 			// else if ( now_page == "interested" ) {
// 			//     interested();
// 			// }
// 			// else if ( now_page == "heads_up" ) {
// 			//     headsUp();
// 			// }
// 			else {
// 				// if ( login_status == 0 ) {
// 				// 	logIn();
// 				// }
// 				// else if ( login_status == 1 ) {
// 				// 	myProfile();
// 				// }
//                 <% if(me) {%>
//                     myProfile();
//                 <% }else{ %>
//                     logIn();
//                 <% } %> 
// 			}
// 		}
// 	});

// 	$( "#side_message" ).click(function() {
// 		if ( now_tab == "message" ) {
// 			switchSidebar("close");
// 		}
// 		else {
// 			now_tab = "message";
// 			switchSidebar("open");
// 			setTimeout(function(){
// 				$( "#side_message" ).addClass("active");
// 			},200);
// 		}
// 	});

// 	$( "#side_search, #search" ).click(function() {
// 		if ( now_tab == "search" ) {
// 			switchSidebar("close");
// 		}
// 		else {
// 			search();
// 			now_tab = "search";
// 			switchSidebar("open");
// 			setTimeout(function(){
// 				$( "#side_search" ).addClass("active");
// 			},200);
// 		}
// 	});


// 	$( ".sidebar_cover" ).click(function() {
// 		switchSidebar("close");
// 	}); 


// 	// Button Listener

// 	$( "#sidebar_signup, #dont_have_account" ).click(function() {
// 		signUp();
// 	});

// 	$( "#sidebar_login" ).click(function() {
// 		logIn();
// 	});

// 	$( "#sidebar_interested" ).click(function() {
// 		interested();
// 	});

// 	$( "#sidebar_profile" ).click(function() {
// 		myProfile();
// 	});

// 	$( "#sidebar_headsup" ).click(function() {
// 		headsUp();
// 	});

// 	$( ".dropdown-content" ).click(function() {
// 		if ($(this).hasClass("opened")) {
// 			$(this).removeClass("opened");
// 		}
// 		else {
// 			$(this).addClass("opened");
// 			$(this).siblings().removeClass("opened");
// 		}
// 	});

// 	$( ".selectable" ).click(function() {
// 		selectItem($(this));
// 	});

// 	$( "#side_btn_login" ).click(function() {
// 		loginSuccess();
// 	});

// 	$( "#side_btn_logout" ).click(function() {
// 		logoutSuccess();
// 	});

// 	$( "#side_btn_signup" ).click(function() {
// 		switchHalfscreen("open");
// 	});

// 	$( "#side_edit_save, #side_edit_cancel" ).click(function() {
// 		switchHalfscreen("close");
// 	});

// 	// Other Listeners
	
// 	$( ".sidebar_cont" ).hover(
// 		function() {
// 			$.fn.fullpage.setAllowScrolling(false);
// 		}, function() {
// 			$.fn.fullpage.setAllowScrolling(true);
// 	});
	

// 	// login按鈕按下送出
// 	$("#loginSubmit").on("click", function() {
// 	  if($("#side_cont_login input[name=userid]").val() != "") {
// 		$.ajax({
// 		  url: "/users/auth",
// 		  type: "POST",
// 		  data: $("#side_cont_login").serialize(),
// 		  success: function(response) {
// 			if(response == "ok") {
// 			  window.location.href = "/";
// 			} else {
// 			  toastr.error(response["error"]);
// 			}
// 		  }
// 		});
// 	  }
// 	});

// 	// signup 按鈕按下送出
// 	$("#signupSubmit").on("click", function() {
// 		$.ajax({
// 			url: "/users/signup",
// 			type: "POST",
// 			data: $("#side_cont_signup").serialize(),
// 			success: function(response) {
// 				if(response == "ok") {
// 					window.location.href = "/";
// 				} else {
// 					for(var i in response["error"]) {
// 						toastr.error(`<p>${response["error"][i]}</p>`);
// 						// $("#signupForm .errormsg").append(`<p>${response["error"][i]}</p>`);
// 					}
// 				}
// 				now_tab = "profile";
// 				switchSidebar("open");
// 				setTimeout(function(){
// 					$( "#side_profile" ).addClass("active");
// 				},200);
// 			}
// 		});
// 	});

// 	// 綁定按下enter = 送出資料
// 	$(document).keypress(function(e) {
// 		// if(e.which == 13 && $('#msgText').val() != "") {
// 		//     sendMessage();
// 		// }

// 		if ($('.sidebar_cont').css('opacity') == 0) return; // 如果沒打開側邊欄，就不啟動功能

// 		if(e.which == 13 && $('#side_cont_login').css('display') == "block"){
// 			$('#loginSubmit').trigger('click');
// 		}

// 		if(e.which == 13 && $('#side_cont_signup').css('display') == "block"){
// 			$('#signupSubmit').trigger('click');
// 		}
// 	});

// 	// Functions

// 	function switchSidebar( command ) {
// 		$( ".side_icon" ).removeClass("active");
// 		if ( command == "open" ) {
// 			sidebar_open = 1;
// 			if ( halfscreen_open == 1 )
// 				switchHalfscreen("close");
// 			$( ".sidebar_cont, .sidebar_cover" ).show();
// 			$( ".sidebar_cont" ).css({'right':'94px','opacity':'0.95'});
// 		}
// 		if ( command == "close" ) {
// 			sidebar_open = 0;
// 			if ( halfscreen_open == 0 )
// 				switchHalfscreen("open");
// 			now_tab = "none";
// 			$( ".sidebar_cont" ).css({'right':'60px','opacity':'0'});
// 			setTimeout(function(){
// 				$( ".sidebar_cont, .sidebar_cover" ).hide();
// 			}, 700 );
// 		};
// 	}

// 	function switchHalfscreen( command ) {
// 		if ( command == "open" ) {
// 			halfscreen_open = 1;
// 			if ( sidebar_open == 1 )
// 				switchSidebar("close");
// 			$( ".side_halfscreen, .halfscreen_cover" ).show();
// 			$( ".side_halfscreen" ).css({'right':'0'});
// 		}
// 		if ( command == "close" ) {
// 			halfscreen_open = 0;
// 			if ( sidebar_open == 0 )
// 				switchSidebar("close");
// 			$( ".side_halfscreen" ).css({'right':'-1000px'});
// 			setTimeout(function(){
// 				$( ".side_halfscreen, .halfscreen_cover" ).hide();
// 			}, 700 );
// 		};
// 	}

// 	function signUp() {
// 		$( "#sidebar_signup" ).addClass("active");
// 		$( "#sidebar_login" ).removeClass("active");
// 		$( ".side_menu" ).hide();
// 		$( "#side_menu_profile_before" ).show();
// 		$( ".side_cont_page" ).fadeOut(200);
// 		$( "#side_cont_signup" ).fadeIn(800);
// 		$( ".triangle" ).css({'left':'70%'});
// 		now_page = "sign_up";
// 	}

// 	function logIn() {
// 		$( "#sidebar_login" ).addClass("active");
// 		$( "#sidebar_signup" ).removeClass("active");
// 		$( ".side_menu" ).hide();
// 		$( "#side_menu_profile_before" ).show();
// 		$( ".side_cont_page" ).fadeOut(200);
// 		$( "#side_cont_login" ).fadeIn(800);
// 		$( ".triangle" ).css({'left':'20%'});
// 		now_page = "log_in";
// 	}
// 	function interested() {
// 		$( "#sidebar_interested" ).addClass("active");
// 		$( "#sidebar_headsup" ).removeClass("active");
// 		$( "#sidebar_profile" ).removeClass("active");
// 		$( ".side_menu" ).hide();
// 		// ...show
// 		$( ".side_cont_page" ).fadeOut(200);
// 		// ...fadeIn
// 		$( ".triangle" ).css({'left':'13%'});
// 		now_page = "interested";
// 	}

// 	function myProfile() {
// 		$( "#sidebar_profile" ).addClass("active");
// 		// $( "#sidebar_headsup" ).removeClass("active");
// 		// $( "#sidebar_interested" ).removeClass("active");
// 		$( ".side_menu" ).hide();
// 		$( "#side_menu_profile_after" ).show();
// 		$( ".side_cont_page" ).fadeOut(200);
// 		$( "#side_cont_myprofile" ).fadeIn(800);
// 		// $( ".triangle" ).css({'left':'46%'});
// 		now_page = "my_profile";
// 	}

// 	function headsUp() {
// 		$( "#sidebar_headsup" ).addClass("active");
// 		$( "#sidebar_profile" ).removeClass("active");
// 		$( "#sidebar_interested" ).removeClass("active");
// 		$( ".side_menu" ).hide();
// 		// ...show
// 		$( ".side_cont_page" ).fadeOut(200);
// 		// ...fadeIn
// 		$( ".triangle" ).css({'left':'80%'});
// 		now_page = "heads_up";
// 	}

// 	function search() {
// 		$( ".side_menu" ).hide();
// 		$( "#side_menu_search" ).show();
// 		$( ".side_cont_page" ).fadeOut(200);
// 		$( "#side_cont_search" ).fadeIn(800);
// 		now_page = "search";
// 	}

// 	function loginSuccess() {
// 		$( ".sidebar_cont" ).addClass("widewidth");
// 		login_status = 1;
// 		myProfile();
// 	}

// 	function logoutSuccess() {
// 		$( ".sidebar_cont" ).removeClass("widewidth");
// 		login_status = 0;
// 		logIn();
// 	}

// 	function selectItem(item) {
// 		var selected = item.text();
// 		item.siblings(".default").text(selected);
// 		item.siblings(".hidden").removeClass("hidden");
// 		item.addClass("hidden");
// 	}
// });
