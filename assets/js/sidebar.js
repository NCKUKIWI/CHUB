$(document).ready(function() {
	// sidebar

	// 登入&註冊按鈕綁定
		$("#signupPart").hide();
		$("#loginPart").show();
	$("#loginbtn").click(function() {
		$("#signupPart").hide();
		$("#loginPart").show();
	});

	$("#signupbtn").click(function() {
		$("#signupPart").show();
		$("#loginPart").hide();
	});

	// 綁定右邊menu的按紐開啟側邊欄
	$('#mainSidebar').sidebar('attach events', '#profilebtn', 'push');
	$('#msgSidebar').sidebar('attach events', '#msgbtn', 'push')
	$('#msgSidebar').sidebar({
		onHide: function () {
			findNotSendMessageUser();
		}
	});

	$('#searchSidebar').sidebar('attach events', '.searchbtn', 'push')

	// search
	$('select.dropdown').dropdown();

	// show setting profile
	$('#goSetting').on('click', function(){
		$('#profile').hide();
		$('#setting').show();
	})
	$('#finishProfile').on('click', function(){
		$('#setting').hide();
		$('#profile').show();
	})
	$('#backProfile').on('click', function(){
		$('#setting').hide();
		$('#profile').show();
	})
	$('#updateProfile').on('click', function(){
		var skillNum = $('#showSkills a').children().length;
		var skillArr = [];

		var Data = $('#updateForm').serialize();
		for(var i = 0; i < skillNum; i++){
			Data += '&skill=' + $('#showSkills a')[i].text;
		}
		$.ajax({
			url: 'users/update',
			method: "POST",
			data: Data,
			success: function(response) {

			}
		})
		$('#backProfile').trigger( "click" );
	})
	$('#addSkill').on('click', function(){
		if($("input[name='textSkill']").val() == "") return;
		var skillNum = $('#showSkills a').children().length;
		var skillArr = [];

		if(skillNum == 3){
			alert('最多三個skill');
			$("input[name='textSkill']").val('');
			return 0;
		}

		var skill = $("input[name='textSkill']").val();
		$("input[name='textSkill']").val('');
		$('#showSkills').append('<a class="ui tag label">' + skill + '<i class="icon close"></i></a>');
		$('#showSkills a').on('click', function(){
			$(this).remove();
		})
		var Data = $('#updateForm').serialize();
		for(var i = 0; i < skillNum; i++){
			Data += '&skill=' + $('#showSkills a')[i].text;
		}
		$.ajax({
			url: 'users/update',
			method: "POST",
			data: Data,
			success: function(response) {
				console.log('add suuces!');
			}
		})
	})

	$('#showSkills a').on('click', function(){
		$(this).remove();
	})

	// message js group
	$('#msgSend').on('click', function(){
		sendMessage();
	})
	$(document).keypress(function(e) {
		if(e.which == 13 && $('#msgText').val() != "") {
			sendMessage();
		}
		if(e.which == 13 && $('#loginPart').css('display') == "block"){
			$('#loginSubmit').trigger('click');
		}
		if(e.which == 13 && $('#signupPart').css('display') == "block"){
			$('#signupSubmit').trigger('click');
		}
	});
});
var test;

// 送出訊息
function sendMessage(){
	var sendMsg = $('#msgText').val();

	var toID = $("#userSidebar > .item.active").attr("userid");
	$(".chatCont > div[messageuserid=\'" + toID + "\']").append('<li class="chatEntry chatSent"><img class="avatar" src="//placekitten.com/56/56" /><p class="message">'+sendMsg+'<time class="timestamp">4 minutes ago</time></p></li>');
	$('#msgText').val('');

	var Data = "touid=" + toID + "&context=" + sendMsg;
	console.log(Data);
	$.ajax({
		url: 'messages/send',
		method: "POST",
		data: Data,
		headers: { "cache-control": "no-cache" },
		success: function(response) {
		}
	})
}

// 收到訊息
// function getMessage(receiveText){
// 	var getMsg = receiveText;
// 	$(".chatCont").append('<li class="chatEntry"><img class="avatar" src="//placekitten.com/g/50/50" /><p class="message">'+getMsg+'<time class="timestamp">4 minutes ago</time></p></li>');
// }

function changeMessageBoard(){
	$('#userSidebar > .item').removeClass("active");
	$(this).addClass("active");
	var userID = $(this).attr("userid");
	$('.chatCont > div').hide();
	$(".chatCont > div[messageuserid=\'" + userID + "\'").show();
}

// 假設使用者沒有傳訊息的話～就把資料刪除
function findNotSendMessageUser(){
	var messageArr = $('.chatCont > div');
	console.log(messageArr);
	for(var i in messageArr){
		if($(messageArr[i]).children().length == 0){
			var id = $(messageArr[i]).attr('messageuserid');
			$("#userSidebar > .item[userid=\'" + id + "\']").remove();
			$(".chatCont > div[messageuserid=\'" + id + "\'").remove();
			break;
		}
	}
}

// 假設使用者未登入
function NotLogin(){
	$(".ui.modal").modal("hide");
	$('#mainSidebar').sidebar('toggle');
}
