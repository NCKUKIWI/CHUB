var now_sort = "hot",
		window_status = "closed",
		pic_window_status = "closed",
    view_scroll_now = 0, 
    view_pic_total, 
    view_display_now = 1, 
    view_display_prev, 
    view_display_next;

$(document).ready(function(){ 


  // project
	$('.display_item[project-id]').click(function() {
        project_show_window(this.getAttribute('project-id'));
	});

	//activity
	$('.display_item[activity-id]').click(function() {
		activity_show_window(this.getAttribute('activity-id'));
	});

	// 先客製化綁定what's on 第二頁的東西
	$('#news_list.control').click(function() {
		project_show_window(this.getAttribute('project-id'));
    })
    
    $( ".cont_slide.right" ).click( function() {
        var move_distance = $(window).height()*0.15 + $(window).width()*0.05 ;
        move_distance *= 3 ;
        $(this).parents(".cont").children(".round_display").animate({ scrollLeft: '+=' + move_distance }, 500);
    });
    
    $( ".cont_slide.left" ).click( function() {
        var move_distance = $(window).height()*0.15 + $(window).width()*0.05 ;
        move_distance *= 3 ;
        $(this).parents(".cont").children(".round_display").animate({ scrollLeft: '-=' + move_distance }, 500);
    });

  // Fullpage 相關
  $( "#fullpage" ).fullpage({
  	onLeave (index, nextIndex, direction){
  		if(nextIndex == 3){
  			$('#menu').fadeOut();
        $('.cover').fadeOut();
        $('.bottom').fadeOut();
        $('.whatOn_cover').fadeIn();
  		}
  		else if(nextIndex == 1){
  			$('#menu').fadeIn();
  			$('.cover').fadeOut();
  		}
  		else{
  			$('#menu').fadeIn();
        $('.whatOn_cover').fadeOut();
        $('.cover').fadeIn();
        $('.bottom').fadeIn();
  		}
  	}
  });
});

$(window).on( "load", function () {

    // 初始化
    galleryInit();
    preGalleryGoto("next");
    preGalleryGoto("prev");
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


    // $( ".no_autoscroll" ).hover(
    //     function() {
    //         $.fn.fullpage.setAutoScrolling(false);
    //     }, function() {
    //         $.fn.fullpage.setAutoScrolling(true);
    //     }
    // );
    $(".not_yet").each(function() {
        autoAdjust($(this));
    });
});

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
    else {
        outer_div.addClass("tall");
        outer_div.removeClass("not_yet");
    }
}

function animationPlay( start_img ) {        
    var next_img = start_img.next(".invisible");
    if ( next_img.length ) {
        if ( next_img.attr('id') == "final" ) {
            next_img.addClass("visible").addClass("animated").addClass("bounce").removeClass("invisible");
            if($('#whats_on_enter').hasClass('active')){
            	setTimeout("$.fn.fullpage.moveSectionDown()", 1500);
            }
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


// project_function
function project_show_window(id){
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
					$("#project_pic").on( "load", function () {
						autoAdjustProjectInner();
					});
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

// 自動調整圖片大小
function autoAdjustProjectInner () {
	var inner_pic_size = $("#project_pic").css("width").replace("px","") / $( "#project_pic" ).css("height").replace("px","") ;
	var outer_div_size = 25/35 ;
	if ( inner_pic_size > outer_div_size ) {
	    $("#project_pic").addClass("fat");
	}
	else {
	    $("#project_pic").addClass("tall");
	}
}


// activity function
function activity_show_window(id){
  if ( window_status == 'closed' ) {
    $.ajax({
      url: "/activities/" + id,
      type: "POST",
      success: function(response) {
        $.fn.fullpage.setAllowScrolling(false, "down,up"); // 停止第一層的fullpage滑動
        $(".float_window").append(response);
        $("#close_window, .dark_mask").click(function() {
            close_window();
        });
        $( ".float_window" ).show();
        // $( ".float_pic_window" ).hide();
        $( "#fullpage, .cover" ).animate({opacity: 0.1}, 100, function() {
            window_status = 'open';
            $( '.float_window' ).animate({opacity: 1}, 500);
        });
        // 綁定顯示輪播照片功能
        $( ".brief_pic, #close_pic_view" ).click( function() {
          float_pic_window();
        });

        // $(window).on('load',function() {
	       //  // 自動調整圖片大小
	       //  $(".float_window .not_yet").each (function() {
	       //      autoAdjust($(this));
	       //      console.log('done');
	       //  });
	       //  conosle.log('in??');

        // })

        $(".float_window .not_yet img").on('load', function() {
	        $(".float_window .not_yet").each (function() {
	            autoAdjust($(this));
	            console.log('done');
	        });
        })



        // 綁定輪播照片左右移動
        pic_window_control()
      }
    });

  }
}

function close_window(){
  if ( window_status == 'open' ) {
    if ( pic_window_status == 'open' ) {
        pic_window_status = 'closed';
        $( ".float_pic_window" ).animate({opacity: 0}, 500, function() {
            $( ".float_pic_window" ).hide();
            $( "#detail_left, #detail_right" ).show();
            $( "#detail_left, #detail_right" ).animate({opacity: 1}, 500);
        });
        return;
    }
    $("#fullpage").animate({opacity: 1}, 500);
    $(".cover").animate({opacity: 0.3}, 500);
    $( ".float_window" ).animate({opacity: 0}, 500, function() {
        window_status = 'closed';
        $(".float_window").hide();
        $(".float_window").empty();
        $.fn.fullpage.setAllowScrolling(true, "down,up"); // 停止第一層的fullpage滑動
    });
  }
}

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
        slidesPerView: 2,
        // slidesPerView: 'auto',
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 30,
        loop: false,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        breakpoints: {
            640: {
              slidesPerView: 1
            }
        }
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
	$( "#go_prev" ).click( function() {
    if ( view_scroll_now > $(".gallery_view_pic").width()/2 + 120 ) {
      view_display_now -= 1 ;
      view_scroll_now -= $(".gallery_view_pic").width() + 60 ;
      $("#view_all_pic").animate( {scrollLeft: view_scroll_now}, '500');
    }
	});

	$( "#go_next" ).click( function() {
    if ( view_scroll_now < $(".gallery_view_pic").width()/2 + (view_pic_total-1) * ($(".gallery_view_pic").width() )){
      view_display_now += 1 ;
      view_scroll_now += $(".gallery_view_pic").width() + 60 ;
      $("#view_all_pic").animate( {scrollLeft: view_scroll_now}, '500');
    }
	});

	$( "#view_all_pic" ).scroll( function() {
    view_display_prev = view_display_now - 1 ;
    view_display_next = view_display_now + 1 ;
    $( "#view_all_pic" ).children( "#pic_"+view_display_now ).addClass("center");
    $( "#view_all_pic" ).children( "#pic_"+view_display_prev+", #pic_"+view_display_next ).removeClass("center");
    $( ".pic_counter.now" ).text( paddingLeft(view_display_now) );
    if ( view_scroll_now > $(".gallery_view_pic").width()/2 + 120 )
        $( "#go_prev" ).removeClass("disabled");
    else
        $( "#go_prev" ).addClass("disabled");
    if ( view_scroll_now < $(".gallery_view_pic").width()/2 + (view_pic_total-1) * ($(".gallery_view_pic").width() ))
        $( "#go_next" ).removeClass("disabled");
    else
        $( "#go_next" ).addClass("disabled");
	}); 
}