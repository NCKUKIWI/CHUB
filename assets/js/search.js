$(document).ready(function() {
	$("#searchSubmit").on("click", function() {
		window.location.href="/users?talent="+$("input[name=talent]").val()+"&major="+$("input[name=major]").val();
	});
});
