var controller = function(name,views) {
var cname = name.charAt(0).toUpperCase() + name.slice(1);
cname = cname.slice(0, -1);
var route="";
if(views.length>0){
  views.forEach(function(view,index){
    var list = [];
    if(index!=0){
      if(view=="index"){
        list.push("","index");
      }else if (view=="show"){
        list.push(":id","show");
      }else{
        list.push(view,view);
      }
      route+=`
router.get("/${list[0]}", function(req,res) {
  res.render("${name}/${list[1]}");
});
`;
    }
  });
}
return `var express = require("express");
var router = express.Router();
var ${cname} = require('../model/${cname}');

${route}

module.exports = router;`;
}

var view = function() {
  return `<% layout('../public/layout') %>`;
}

var model = function(name,schemalist) {
  var cname = name.charAt(0).toUpperCase() + name.slice(1);
  var schema="";
  if(schemalist){
    for(var i in schemalist){
      var slice = schemalist[i].split(":");
      slice[1]=slice[1].charAt(0).toUpperCase() + slice[1].slice(1);
      schema+= `  ${slice[0]}:${slice[1]}`;
      if(i!=schemalist.length-1) schema+=",\n"
    }
  }
  return `var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*
Schema Type
------------
What? => In mongoose
Words => String
True/False => Boolean
Integer => Number
Array => []
Array of String => [String]
*/

var ${name}Schema = new Schema({
${schema}
});

/*
${name}Schema.methods.customMethod = function() {
  return this.model("${cname}").find();
};
*/

var ${cname} = mongoose.model("${cname}", ${name}Schema);

module.exports = ${cname};`;
}

exports.model = model;
exports.view = view;
exports.controller = controller;
