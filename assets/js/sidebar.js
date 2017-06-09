$(document).ready(function() {
	$("#signupPart").hide();
	$("#forgetPw").hide();

	//按下登入
	$("#loginbtn").click(function() {
		$("#signupPart").hide();
		$("#forgetPw").hide();
		$("#loginPart").show();
	});

	//按下註冊
	$("#signupbtn").click(function() {
		$("#loginPart").hide();
		$("#forgetPw").hide();
		$("#signupPart").show();
	});

	//按下忘記密碼
	$("#forgetbtn").click(function() {
		$("#signupPart").hide();
		$("#loginPart").hide();
		$("#forgetPw").show();
	});

	// 綁定右邊menu的按紐開啟側邊欄
	$("#mainSidebar").sidebar("attach events", "#profilebtn", "push");
	$("#searchSidebar").sidebar("attach events", ".searchbtn", "push");
	$("#msgSidebar").sidebar("attach events", "#msgbtn", "push");
	$("#msgSidebar").sidebar({
		onHide: function () {
			findNotSendMessageUser();
		}
	});

	//顯示Setting
	$('#goSetting').on('click', function(){
		$('#profile').hide();
		$('#setting').show();
	})
	// $('#finishProfile').on('click', function(){
	// 	$('#setting').hide();
	// 	$('#profile').show();
	// })
	$('#backProfile').on('click', function(){
		$('#setting').hide();
		$('#profile').show();
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
	// 如果是通知的那個區塊，就把send隱藏，沒有就顯示
	if($('#userSidebar > .item.active > .mail').length == 1){
		$('#inputMsg').hide();
		$('.chatCont > div').hide();
		return;
	}
	else $('#inputMsg').show();
	var userID = $(this).attr("userid");
	$('.chatCont > div').hide();
	$(".chatCont > div[messageuserid=\'" + userID + "\']").show();
}

// 假設使用者沒有傳訊息的話～就把資料刪除
function findNotSendMessageUser(){
	var messageArr = $('.chatCont > div');
	console.log(messageArr);
	for(var i in messageArr){
		if($(messageArr[i]).children().length == 0){
			var id = $(messageArr[i]).attr('messageuserid');
			$("#userSidebar > .item[userid=\'" + id + "\']").remove();
			$(".chatCont > div[messageuserid=\'" + id + "\']").remove();
			break;
		}
	}
}

// 假設使用者未登入
function NotLogin(){
	$(".ui.modal").modal("hide");
	$('#mainSidebar').sidebar('toggle');
}
