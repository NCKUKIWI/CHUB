$(document).ready(function(){
  $('.special.cards .image').dimmer({
    on: 'hover'
  });
  $('.info').on('click', function(){
    $('.personalInfo').modal('show')
  });
})