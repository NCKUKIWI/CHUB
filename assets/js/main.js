$(document).ready(function() {
	// sidebar
	$("#loginbtn").click(function() {
		$('#loginbar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
	});

	$("#msgbtn").click(function() {
		$('#msgbar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
	});

	$("#searchbtn").click(function() {
		$('#searchbar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
	});

	// search
	$('select.dropdown').dropdown();
});
