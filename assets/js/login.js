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
						$("#loginForm .errormsg").empty();
						$("#loginForm .errormsg").append(response["error"])
					}
				}
			});
		}
	});
	$("#signupSubmit").on("click", function() {
		$.ajax({
			url: "/users/signup",
			type: "POST",
			data: $("#signupForm").serialize(),
			success: function(response) {
				if(response == "ok") {
					window.location.href = "/";
				} else {
					$("#signupForm .errormsg").empty();
					for(var i in response["error"]) {
						$("#signupForm .errormsg").append(`<p>${response["error"][i]}</p>`);
					}
				}
			}
		});
	});
});
