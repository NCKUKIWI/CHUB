$(document).ready(function(){


// sidebar
    $( "#loginbtn" ).click(function() {
        $('#loginbar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    });

    $( "#msgbtn" ).click(function() {
        $('#msgbar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    });
    
    $( "#searchbtn" ).click(function() {
        $('#searchbar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    });

// login
    $("#loginSubmit").on("click",function(){
      if($("input[name=userid]").val()!=""){
        $.ajax({
          url: "/users/auth",
          type: "POST",
          data: $("#loginForm").serialize(),
          success: function(response) {
            if (response == "ok") {
              window.location.href="/";
            }
            else {
              $("#errormsg").empty();
              $("#errormsg").append(response["error"])
            }
          }
        });
      }
    });

    // search
    $('select.dropdown').dropdown();

});