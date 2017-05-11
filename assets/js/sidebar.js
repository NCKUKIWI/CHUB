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
		$('#mainSidebar').css('width', '300px');
		$('#setting').hide();
		$('#profile').show();
		$('#msgSidebar').sidebar('setting', 'transition', 'overlay');
	})
	$('#backProfile').on('click', function(){
		$('#mainSidebar').css('transition-property', 'width');
		$('#mainSidebar').css('transition-duration', '0.8s');
		$('#mainSidebar').css('width', '300px');
		$('#setting').hide();
		$('#profile').show();
		$('#msgSidebar').sidebar('setting', 'transition', 'overlay');
	})
	$('#updateProfile').on('click', function(){
		console.log($('#updateForm').serialize());
		$.ajax({
			url: 'users/update',
			method: "POST",
			data: $('#updateForm').serialize(),
			success: function(response) {
				
			}
		})
		$('#backProfile').trigger( "click" );
	})
	$('#addSkill').on('click', function(){
		var skillNum = $('#showSkills a').children().length;
		var skillArr = [];
		
		if(skillNum == 3){
			alert('最多三個skill');
			$("input[name='skill']").val('');
			return 0;
		}
		var Data = $('#updateForm').serialize();
		for(var i = 0; i < skillNum; i++){
			Data += '&skill=' + $('#showSkills a')[i].text;
		}
		console.log(Data);
		$.ajax({
			url: 'users/update',
			method: "POST",
			data: Data,
			success: function(response) {
				
			}
		})

		var skill = $("input[name='skill']").val();
		$("input[name='skill']").val('');
		$('#showSkills').append('<a class="ui tag label">' + skill + '<i class="icon close"></i></a>');
		$('#showSkills a').on('click', function(){
			$(this).remove();
		})
	})

	$('#showSkills a').on('click', function(){
		$(this).remove();
	})

	$('#msgSend').on('click', function(){
		sendMessage();
	})
	$(document).keypress(function(e) {
		if(e.which == 13) {
			sendMessage();
		}
	});
});


// 送出訊息
function sendMessage(){
	var sendMsg = $('#msgText').val();
	$(".chatCont").append('<li class="chatEntry chatSent"><img class="avatar" src="//placekitten.com/56/56" /><p class="message">'+sendMsg+'<time class="timestamp">4 minutes ago</time></p></li>');
	$('#msgText').val('');
}

// 收到訊息
function getMessage(receiveText){
	var getMsg = receiveText;
	$(".chatCont").append('<li class="chatEntry"><img class="avatar" src="//placekitten.com/g/50/50" /><p class="message">'+getMsg+'<time class="timestamp">4 minutes ago</time></p></li>');
}