$(document).ready(function(){

    // Background 的顯示控制

    $( "#people_intro, #project_intro, #people_view" ).mouseover(function() {
        $(".project_cover").animate({opacity: 0}, 500, function() {
            $(".cover").animate({opacity: 0.3}, 1000);
        });
    });

    $( "#project_view").mouseover(function() {
        $(".cover").animate({opacity: 0}, 500, function() {
            $(".project_cover").animate({opacity: 0.3}, 1000);
        });
    });

    $( "#footer" ).mouseover(function() {
        $(".cover").animate({opacity: 0}, 500);
        $(".project_cover").animate({opacity: 0}, 500);
    });

});
