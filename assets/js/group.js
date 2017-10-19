$(document).ready(function() {

  // Initialize

  var now_sort = "hot", // 搜尋條件預設“熱門”
    window_status = "closed", // 浮動視窗狀態
    pic_window_status = "closed",
    view_scroll_now = 0, 
    view_pic_total, 
    view_display_now = 1,
    view_display_prev, 
    view_display_next;


  $("#fullpage").fullpage();
  $(".float_window").hide();
  $("#left_group").addClass("item_now");
  view_pic_total = 5;

  // swiper initialize
  var swiper = new Swiper('.swiper-container', {
      // slidesPerView: 1,
      slidesPerView: 'auto',
      centeredSlides: false,
      spaceBetween: 30,
      loop: false,
      nextButton: '.go_to.next',
      prevButton: '.go_to.prev',
      breakpoints: {
          640: {
            slidesPerView: 1
          }
      }
  });

	$(".group_item").click(function() {
		show_window(this.getAttribute('group-id'));
	});



  function show_window(id){
    if(window_status == 'closed') {
      $.ajax({
        url: "/groups/" + id,
        type: "POST",
        success: function(response) {
        	$.fn.fullpage.setAllowScrolling(false, "down,up"); // 停止第一層的fullpage滑動
          $(".float_window").append(response);
          $("#close_window, .dark_mask").click(function() {
            close_window();
          });
          $(".float_window").show();
          $( ".float_pic_window" ).hide();
          // 自動調整圖片大小
	        $(".brief_pic.not_yet img").on('load', function() {
		        $(".brief_pic.not_yet").each (function() {
		            autoAdjust($(this));
		        });
	        })
          $("#fullpage, .cover").animate({
            opacity: 0.1
          }, 100, function() {
            window_status = 'open';
            $('.float_window').animate({
              opacity: 1
            }, 500);
          });

				  $( ".brief_pic img, #close_pic_view" ).click( function() {
				      float_pic_window();
				  });
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
  // group照片輪播的浮動視窗

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


});


$(window).on('load',function(){

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