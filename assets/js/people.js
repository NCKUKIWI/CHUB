$(document).ready(function(){

    // Initialize
    var people_chosen, insert_cntr = 0, 
        window_status = "closed", 
        people_hover,
        port_pic_chosen, 
        port_pic_total, 
        port_status = "closed",
        port_pic_display_now, 
        port_pic_display_prev, 
        port_pic_display_next,
        port_scroll_now = 0;

    $("#fullpage").fullpage();
    $( ".float_window" ).hide();
    $( ".float_portfolio" ).hide();
    $( "#left_people" ).addClass("item_now");

  	$(".people_info, .people_pic").click(function() {
  		show_window(this.getAttribute('user-id'));
  	});

    $( ".port_demo, #close_portfolio" ).click( function() {
      float_portfolio();
    });

    // People 的顯示控制
		function show_window(id) {
			if(window_status == 'closed') {
				$.ajax({
					url: "/users/" + id,
					type: "POST",
					success: function(response) {
            $.fn.fullpage.setAllowScrolling(false,"down,up");
						$(".float_window").append(response);
						$("#close_window, .dark_mask").click(function(){
							close_window();
						});
						$(".float_window").show();
						$("#fullpage, .cover").animate({opacity:0.1},100,function(){
							window_status = 'open';
							$('.float_window').animate({opacity:1},500);
						});
					}
				});
			}
		}

		function close_window() {
			console.log("close");
			if(window_status == 'open') {
				$("#fullpage, .cover").animate({opacity:1},500);
				$(".float_window").animate({opacity:0},500,function(){
					window_status = 'closed';
					$(".float_window").hide();
					$(".float_window").empty();
          $.fn.fullpage.setAllowScrolling(true,"down,up");
					if(port_status == 'open') {
						port_status = 'closed';
						$(".float_portfolio").animate({opacity:0},500,function(){
							$(".float_portfolio").hide();
							$("#detail_left, #detail_upper_right, #detail_right").show();
							$("#detail_left, #detail_upper_right, #detail_right").animate({opacity:1},500);
							$("#portfolio").empty();
						});
					}
				});
			}
		}

    // People 的動態控制

    $( ".people_pic" ).hover(
        function() {
            $(this).css({'-webkit-filter':'brightness(30%)','filter':'brightness(30%)'});
            $(this).siblings('.people_more').css({'width':'28px','bottom':'22px','opacity':'1'});
            people_hover = $(this).attr('id');
            people_hover = people_hover.replace("pic", "info");
            $('#'+people_hover).children('.after').css({'width':'40px'});
        }, function() {
            $(this).css({'-webkit-filter':'brightness(100%)','filter':'brightness(100%)'});
            $(this).siblings('.people_more').css({'width':'20px','bottom':'26px','opacity':'0'});
            $('#'+people_hover).children('.after').css({'width':'0px'});
    });

    $( ".people_info" ).hover(
        function() {
            $(this).children('.after').css({'width':'40px'});
            people_hover = $(this).attr('id');
            people_hover = people_hover.replace("info", "pic");
            $('#'+people_hover).css({'-webkit-filter':'brightness(20%)','filter':'brightness(20%)'});
            $('#'+people_hover).siblings('.people_more').css({'width':'28px','bottom':'22px','opacity':'1'});
        }, function() {
            $(this).children('.after').css({'width':'0px'});
            $('#'+people_hover).css({'-webkit-filter':'brightness(100%)','filter':'brightness(100%)'});
            $('#'+people_hover).siblings('.people_more').css({'width':'20px','bottom':'26px','opacity':'0'});
    });

    $( "#view_right, #view_left, .float_window" ).hover(
        function() {
            $.fn.fullpage.setAllowScrolling(false);
        }, function() {
            $.fn.fullpage.setAllowScrolling(true);
    });


    // Portfolio 的顯示控制

    function float_portfolio () {
        if ( port_status == 'closed' ) {
            port_status = 'open';
            $( "#detail_left, #detail_upper_right, #detail_right" ).animate({opacity: 0}, 500);
            $( "#detail_left, #detail_upper_right, #detail_right" ).hide();
            $( ".float_portfolio" ).show();
            $( "#fullpage, .cover" ).animate({opacity: 0}, 100, function() {
                $( ".float_portfolio" ).animate({opacity: 1}, 500);
            });
            portfolio_update(10);
        }
        else if ( port_status == 'open' ) {
            port_status = 'closed';
            $( "#fullpage, .cover" ).animate({opacity: 0.1}, 500);
            $( ".float_portfolio" ).animate({opacity: 0}, 500, function() {
                $( ".float_portfolio" ).hide();
                $( "#detail_left, #detail_upper_right, #detail_right" ).show();
                $( "#detail_left, #detail_upper_right, #detail_right" ).animate({opacity: 1}, 500);
                $( "#portfolio" ).empty();
            });
        }
    }

    function paddingLeft ( num ) {
	    if ( num < 10 )
            return  "0" + num;
	    else
            return num;
    }


    // Portfolio 的動態控制

    $( "#go_prev" ).click( function() {
        if ( port_scroll_now > $(".portfolio_pic").width()/2 + 120 ) {
            port_pic_display_now -= 1 ;
            port_scroll_now -= $(".portfolio_pic").width() + 60 ;
            $("#portfolio").animate( {scrollLeft: port_scroll_now}, '500');
        }
    });

    $( "#go_next" ).click( function() {
        if ( port_scroll_now < $(".portfolio_pic").width()/2 + 120 + (port_pic_total-1) * ($(".portfolio_pic").width()+60) ) {
            port_pic_display_now += 1 ;
            port_scroll_now += $(".portfolio_pic").width() + 60 ;
            $("#portfolio").animate( {scrollLeft: port_scroll_now}, '500');
        }
    });

    $( "#portfolio" ).scroll( function() {
        port_pic_display_prev = port_pic_display_now - 1 ;
        port_pic_display_next = port_pic_display_now + 1 ;
        $( "#portfolio" ).children( "#port_"+port_pic_display_now ).addClass("center");
        $( "#portfolio" ).children( "#port_"+port_pic_display_prev+", #port_"+port_pic_display_next ).removeClass("center");
        $( ".port_counter.now" ).text( paddingLeft(port_pic_display_now) );
        if ( port_scroll_now > $(".portfolio_pic").width()/2 + 120 )
            $( "#go_prev" ).removeClass("disabled");
        else
            $( "#go_prev" ).addClass("disabled");
        if ( port_scroll_now < $(".portfolio_pic").width()/2 + 120 + (port_pic_total-1) * ($(".portfolio_pic").width()+60) )
            $( "#go_next" ).removeClass("disabled");
        else
            $( "#go_next" ).addClass("disabled");
    });


    // Menu 的顯示控制

    $( ".left_bar" ).hover(
        function() {
            $( "#left_people" ).removeClass("item_now");
        }, function() {
            $( "#left_people" ).addClass("item_now");
    });


});
