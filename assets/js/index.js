$(document).ready(function(){
  /* toastr option */
  toastr.options = {
    "closeButton": true,
    "positionClass": "toast-top-right",
    "showDuration": "0",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000"
  }

  /*semantic setting*/
  $(".card > .image").dimmer({on:"hover"});
  $(".ui.accordion").accordion();
  $('.tabular.menu .item').tab();
  $('.ui.dropdown').dropdown();
  $('.ui.search').search({
    type: 'category',
    minCharacters: 1,
    maxResults: 1, // 一次顯示10筆
    apiSettings: {
      url: '/search?query={query}',
      onResponse: function(results){
        console.log(results);
        return {results};
      }
    }
  });
  $('.ui.search > .results').css('width', 'auto');
});
