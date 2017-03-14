var controller = function(name,views) {
var route="";
if(views.length>0){
  views.forEach(function(view,index){
    if(index!=0){
      route+=`
router.get('/${view}', function(req, res) {
  
});
      `;
    }
  });
}
return `var express = require('express');
var router = express.Router();
var ${name} = require('../model/${name}');

${route}

module.exports = router;`;
}

var view = function() {
return `<% layout('../public/layout') %>`;
}


exports.controller = controller;
exports.view = view;
