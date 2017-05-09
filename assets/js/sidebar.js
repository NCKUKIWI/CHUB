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

	$(".searchbtn").click(function() {
		$('#searchSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
	});

	$("#signupbtn").click(function() {
		$('#mainSidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
		$("#signupPart").show();
		$("#loginPart").hide();
	});

	// search
	$('select.dropdown').dropdown();

	// show setting profile
	$('#goSetting').on('click', function(){
		$('#profile').hide();
		$('#mainSidebar').css('transition-property', 'width');
		$('#mainSidebar').css('transition-duration', '0.8s');
		$('#mainSidebar').css('width', '700px');
		$('#setting').show();
		$('#msgSidebar').sidebar('setting', 'transition', 'overlay');
	})
	$('#finishProfile').on('click', function(){
		$('#mainSidebar').css('transition-property', 'width');
		$('#mainSidebar').css('transition-duration', '0.8s');
		$('#mainSidebar').css('width', '240px');
		$('#setting').hide();
		$('#profile').show();
		$('#msgSidebar').sidebar('setting', 'transition', 'overlay');
	})
	$('#backProfile').on('click', function(){
		$('#mainSidebar').css('transition-property', 'width');
		$('#mainSidebar').css('transition-duration', '0.8s');
		$('#mainSidebar').css('width', '240px');
		$('#setting').hide();
		$('#profile').show();
		$('#msgSidebar').sidebar('setting', 'transition', 'overlay');
	})
	$('#updateProfile').on('click', function(){
		// console.log('userid=' + me._id + $('#updateForm').serialize());
		$.ajax({
			url: 'users/update',
			method: "POST",
			data: $('#updateForm').serialize(),
			success: function(response) {
				
			}
		})
		$('#backProfile').trigger( "click" );
	})
});