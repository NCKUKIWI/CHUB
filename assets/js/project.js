$(document).ready(function() {

	// Initialize

	var now_sort = "hot",
		window_status = "closed",
		pic_window_status = "closed",
		view_scroll_now = 0,
		view_pic_total, 
		view_display_now = 1,
		view_display_prev, 
		view_display_next;

	$('#fullpage').fullpage({
		// 如果滑到瀏覽project的地方，menu自動消失
		onLeave (index, nextIndex, direction){
			if(nextIndex == 1){
				$('#menu').fadeIn();
        $('.project_cover').fadeOut();
        $('.cover').fadeIn();
        $('.bottom').fadeIn();
			}
			else{
				$('#menu').fadeOut();
        $('.cover').fadeOut();
        $('.bottom').fadeOut();
        $('.project_cover').fadeIn();
			}
		}
	});
	$(".float_window").hide();
	$("#left_project").addClass("item_now");
	view_pic_total = 0;

	$(".project_item").click(function() {
		show_window(this.getAttribute('project-id'));
	});

	// Project 的顯示控制
	$("#go_down").click(function() {
		$("#project_list").animate({
			scrollTop: $(window).height() / 2
		}, 500);
	});

	$("#go_up").click(function() {
		$("#project_list").animate({
			scrollTop: -$(window).height() / 2
		}, 500);
	});

	function show_window(id){
		// 先判斷是否手機
		if(Mobile){
			window.location.href = window.location.href + "/id/" + id;
			return;
		}
		if(window_status == 'closed') {
			$.ajax({
				url: "/projects/" + id,
				type: "POST",
				success: function(response) {
					$.fn.fullpage.setAllowScrolling(false, "down,up"); // 停止第一層的fullpage滑動
					$(".float_window").append(response);
					$("#close_window, .dark_mask").click(function() {
						close_window();
					});
					$(".float_window").show();
					$( ".float_pic_window" ).hide();
					$("#fullpage, .cover").animate({
						opacity: 0.1
					}, 100, function() {
						window_status = 'open';
						$('.float_window').animate({
							opacity: 1
						}, 500);
					});

					// 綁定顯示輪播照片功能
				  $( ".brief_pic, #close_pic_view" ).click( function() {
				      float_pic_window();
				  });

				  // 綁定輪播照片左右移動
				  pic_window_control()

				}
			});
		}
	}
	function close_window() {
		if(window_status == 'open') {
			if(pic_window_status == 'open') {
				pic_window_status = 'closed';
				$(".float_pic_window").animate({
					opacity: 0
				}, 500, function() {
					$(".float_pic_window").hide();
					$("#detail_left, #detail_right").show();
					$("#detail_left, #detail_right").animate({
						opacity: 1
					}, 500);
				});
				return ;
			}
			$.fn.fullpage.setAllowScrolling(true, "down,up"); // 啟動第一層的fullpage滑動
			$("#fullpage").animate({
				opacity: 1
			}, 500);
			$(".cover").animate({
				opacity: 0.3
			}, 500);
			$(".float_window").animate({
				opacity: 0
			}, 500, function() {
				window_status = 'closed';
				$(".float_window").hide();
				$(".float_window").empty();

			});
		}
	}

	// Project 的fullpage動態控制
	// $("#project_list .float_window").hover(
	// 	function() {
	// 		$.fn.fullpage.setAllowScrolling(false, "down,up");
	// 		console.log('in');
	// 	},
	// 	function() {
	// 		console.log('on');
	// 		$.fn.fullpage.setAllowScrolling(true, "down,up");
	// 	});

	$("#sort_hot").click(function() {
		now_sort = "hot";
		$("#sort_time").removeClass("now");
		$("#sort_hot").addClass("now");
	});

	$("#sort_time").click(function() {
		now_sort = "time";
		$("#sort_hot").removeClass("now");
		$("#sort_time").addClass("now");
	});


	// Pic Window 的顯示控制

	function float_pic_window() {
		if(pic_window_status == 'closed') {
			pic_window_status = 'open';
			$("#detail_left, #detail_right").animate({
				opacity: 0
			}, 500);
			$("#detail_left, #detail_right").hide();
			$(".float_pic_window").show();
			view_scroll_now = $(".gallery_view_pic").width() / 2 + 120;
			$("#view_all_pic").scrollLeft(view_scroll_now);
			view_pic_total = $(".pic_counter.total").text();
			view_display_now = 1 // 每次從1開始算
			$(".pic_counter.total").text("/" + paddingLeft($(".pic_counter.total").text()));
			$("#fullpage, .cover").animate({
				opacity: 0
			}, 100, function() {
				$("#view_all_pic").children("#pic_" + view_display_now).addClass("center");
				$(".float_pic_window").animate({
					opacity: 1
				}, 500);
			});

      $(".not_yet").each (function() {
          autoAdjust($(this));
      });

      // swiper initialize
	    var swiper = new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
					slidesPerView: 1,
					centeredSlides: true,
					paginationClickable: true,
					spaceBetween: 30,
					loop: false,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev'
	    });
		} else if(pic_window_status == 'open') {
			pic_window_status = 'closed';
			$("#fullpage, .cover").animate({
				opacity: 0.1
			}, 500);
			$(".float_pic_window").animate({
				opacity: 0
			}, 500, function() {
				$(".float_pic_window").hide();
				$("#detail_left, #detail_right").show();
				$("#detail_left, #detail_right").animate({
					opacity: 1
				}, 500);
			});
		}
	}

	function paddingLeft(num) {
		if(num < 10)
			return "0" + num;
		else
			return num;
	}

	// Pic Window 的動態控制
	// 照片的輪播功能

	function pic_window_control(){
		$("#go_prev").click(function() {
			if(view_scroll_now > $(".gallery_view_pic").width() / 2 + 120) {
				view_display_now -= 1;
				view_scroll_now -= $(".gallery_view_pic").width() + 60;
				$("#view_all_pic").animate({
					scrollLeft: view_scroll_now
				}, '500');
			}
		});

		$("#go_next").click(function() {
			if(view_scroll_now < $(".gallery_view_pic").width() / 2 + (view_pic_total - 1) * ($(".gallery_view_pic").width())) {
				view_display_now += 1;
				view_scroll_now += $(".gallery_view_pic").width() + 60;
				$("#view_all_pic").animate({
					scrollLeft: view_scroll_now
				}, '500');
			}
		});

		$("#view_all_pic").scroll(function() {
			view_display_prev = view_display_now - 1;
			view_display_next = view_display_now + 1;
			$("#view_all_pic").children("#pic_" + view_display_now).addClass("center");
			$("#view_all_pic").children("#pic_" + view_display_prev + ", #pic_" + view_display_next).removeClass("center");
			$(".pic_counter.now").text(paddingLeft(view_display_now));
			if(view_scroll_now > $(".gallery_view_pic").width() / 2 + 120)
				$("#go_prev").removeClass("disabled");
			else
				$("#go_prev").addClass("disabled");
			if(view_scroll_now < $(".gallery_view_pic").width() / 2 + (view_pic_total - 1) * ($(".gallery_view_pic").width()))
				$("#go_next").removeClass("disabled");
			else
				$("#go_next").addClass("disabled");
		});
	}

	// Menu 的顯示控制
	$(".left_bar").hover(
		function() {
			$("#left_project").removeClass("item_now");
		},
		function() {
			$("#left_project").addClass("item_now");
		}
	);



});

$(window).on( "load", function () {
	
		// Initialize
		$(".not_yet").each(function() {
			autoAdjust($(this));
		});
	
	});

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