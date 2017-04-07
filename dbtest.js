var User = require("./model/User");
var Project = require("./model/Project");
var helper = require("./helper");

Project.findById("xx",function(err,p){
  console.log(err);
  if(p){
    console.log("p");
  }else{
    console.log(p);
  }
})
