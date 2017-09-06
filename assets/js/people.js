$(document).ready(function() {

	// Initialize
	var window_status = "closed",
		people_hover;
	$('#fullpage').fullpage({
		// 如果滑到瀏覽people的地方，menu自動消失
		onLeave (index, nextIndex, direction){
			if(nextIndex == 1){
				$('#menu').fadeIn();
			}
			else{
				$('#menu').fadeOut();
			}
		}
	});
	$(".float_window").hide();
	$("#left_people").addClass("item_now");

	$(".people_info,.people_pic").click(function() {
		show_window(this.getAttribute("user-id"));
	});

	// People 的顯示控制
	function show_window(id) {
		if(window_status == "closed") {
			window_status = "open";
			$.ajax({
				url: "/users/" + id,
				type: "POST",
				success: function(response) {
					$.fn.fullpage.setAllowScrolling(false, "down,up");
					$(".float_window").append(response);
					$("#close_window, .dark_mask").click(function() {
						close_window();
					});
					$(".float_window").show();
					$("#fullpage, .cover").animate({opacity:0.1},100,function() {
						$(".float_window").animate({opacity:1},500);
					});
				}
			});
		}
	}

	function close_window() {
		if(window_status == "open") {
			window_status = "closed";
			$("#fullpage, .cover").animate({opacity:1},500);
			$(".float_window").animate({opacity:0},500,function(){
				$(".float_window").hide();
				$(".float_window").empty();
				$.fn.fullpage.setAllowScrolling(true,"down,up");
			});
		}
	}

	// People 的動態控制
	$(".people_pic").hover(
		function() {
			$(this).css({
				"-webkit-filter": "brightness(30%)",
				"filter": "brightness(30%)"
			});
			$(this).siblings(".people_more").css({
				"width": "28px",
				"bottom": "22px",
				"opacity": "1"
			});
			people_hover = $(this).attr("id");
			people_hover = people_hover.replace("pic", "info");
			$("#" + people_hover).children(".after").css({
				"width": "40px"
			});
		},
		function() {
			$(this).css({
				"-webkit-filter": "brightness(100%)",
				"filter": "brightness(100%)"
			});
			$(this).siblings(".people_more").css({
				"width": "20px",
				"bottom": "26px",
				"opacity": "0"
			});
			$("#" + people_hover).children(".after").css({
				"width": "0px"
			});
		});

	$(".people_info").hover(
		function() {
			$(this).children(".after").css({
				"width": "40px"
			});
			people_hover = $(this).attr("id");
			people_hover = people_hover.replace("info", "pic");
			$("#" + people_hover).css({
				"-webkit-filter": "brightness(20%)",
				"filter": "brightness(20%)"
			});
			$("#" + people_hover).siblings(".people_more").css({
				"width": "28px",
				"bottom": "22px",
				"opacity": "1"
			});
		},
		function() {
			$(this).children(".after").css({
				"width": "0px"
			});
			$("#" + people_hover).css({
				"-webkit-filter": "brightness(100%)",
				"filter": "brightness(100%)"
			});
			$("#" + people_hover).siblings(".people_more").css({
				"width": "20px",
				"bottom": "26px",
				"opacity": "0"
			});
		});

	$("#view_right, #view_left, .float_window").hover(function() {
		console.log('false')
		$.fn.fullpage.setAllowScrolling(false);
	},function() {
		console.log('true');
		$.fn.fullpage.setAllowScrolling(true);
	});

	// Menu 的顯示控制
	$(".left_bar").hover(function() {
		$("#left_people").removeClass("item_now");
	},function() {
		$("#left_people").addClass("item_now");
	});
});
