$(document).ready(function() {
	$("#searchSubmit").on("click", function() {
		window.location.href="/users?skill="+$("input[name=skill]").val()+"&major="+$("input[name=major]").val();
	});
  // 各個user, project, activity 按鈕綁定
  $('.info').on('click', InfoRouter);
});

// infomation AJAX for people, group, project, activity
// 之後可以在每個info的div裡多加attri 去判斷是哪一種，就不用for迴圈

var Infos = {'user-id': 'users', 'group-id': 'groups', 'project-id': 'projects', 'activity-id': 'activities'};

function InfoRouter(){
  for(var i in Infos){
    if(this.getAttribute(i) !== null){
      var id = this.getAttribute(i);
      var url = "\/" + Infos[i] + "\/" + id;
      console.log('url: ' + url);
      console.log('i: ' + i);
      infoAjax(url);
      break;
    }
  }
}

function infoAjax(url) {
  $.ajax({
    url: url,
    type: "POST",
    headers: { "cache-control": "no-cache" },
    success: function(response) {
      $(".ui.modal").append(response);
      $(".ui.modal").modal({
      onHide: function(){
        $(".ui.modal").empty();
      }}).modal("show");
      $('.openInfo').on('click', openInfo);
    }
  });

}

function openInfo() {
  var type = this.getAttribute('type');
  var id = this.getAttribute('id');
  var win = $(window)[0].open(window.location.origin + '/' + type + '?id=' + id);
}
