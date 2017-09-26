// Initialize
var window_status = "closed",
		people_hover;

var up_detect = 0;
var down_detect = 0;
var down = false;

var last_scrollTop = -1;

$(document).ready(function(){
  $( "#activity_list").on('scroll', function(){
      var now_scrollTop = $(this).scrollTop();

      if(last_scrollTop < now_scrollTop){
          down = true;
          if(last_scrollTop == 0) {
              up_detect = 1;
          }
      }else{
          down = false;
          if($('#activity_list')[0].scrollHeight - $(window).height() < $(this).scrollTop()){
              down_detect = 1; 
          }
      }
      // up
      if(now_scrollTop == 0){
          if(up_detect == 1){
              $.fn.fullpage.moveSectionUp();
              up_detect = 0;
          }
      }
      last_scrollTop = now_scrollTop;

      if($('#activity_list')[0].scrollHeight - $(window).height() < $(this).scrollTop()){
          if(down_detect == 1 && down){
              $.fn.fullpage.moveSectionDown();
              down_detect = 0;
          }
      }
  });
	$(".activity_item").click(function() {
		show_window(this.getAttribute("user-id"));
    });
    
    $( "#page_up" ).click( function() {
        $.fn.fullpage.moveSectionUp();
    });

    $( "#page_down" ).click( function() {
        $.fn.fullpage.moveSectionDown();
    });
    
  $('#fullpage').fullpage({
      // 如果滑到瀏覽activity的地方，menu自動消失
      onLeave (index, nextIndex, direction){
          if(nextIndex != 2){
          	$.fn.fullpage.setAllowScrolling(true);
          }
          else{
          	$.fn.fullpage.setAllowScrolling(false);
            up_detect = 0;
            down_detect = 0;
            last_scrollTop = -1;
          }
      }
  });
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
    else {
        outer_div.addClass("tall");
        outer_div.removeClass("not_yet");
    }
}






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