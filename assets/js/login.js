$(document).ready(function() {
	$("#loginSubmit").on("click", function() {
		if($("input[name=userid]").val() != "") {
			$.ajax({
				url: "/users/auth",
				type: "POST",
				data: $("#loginForm").serialize(),
				success: function(response) {
					if(response == "ok") {
						window.location.href = "/";
					} else {
						$("#errormsg").empty();
						$("#errormsg").append(response["error"])
					}
				}
			});
		}
	});
});
