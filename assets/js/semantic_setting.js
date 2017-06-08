$(document).ready(function(){
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
})
