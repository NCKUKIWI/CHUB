$(document).ready(function() {
	// sidebar
	$("#loginbtn").click(function() {
		$('#mainSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
		$("#signupPart").hide();
		$("#loginPart").show();
	});

	$("#msgbtn").click(function() {
		$('#msgSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
	});

	$("#searchbtn").click(function() {
		$('#searchSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
	});

	$("#signupbtn").click(function() {
		$('#mainSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
		$("#signupPart").show();
		$("#loginPart").hide();
	});

	// search
	$('select.dropdown').dropdown();
});
