var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Activity = require("../model/Activity");
var User = require("../model/User");
var Group = require("../model/Group");
var Project = require("../model/Project");

router.get("/",helper.checkLogin(),function(req,res) {
  Project.find({"AdminID":{"$in":[req.user._id]}},function(err,projects){
    res.render("panel/index",{
      projects:projects
    });
  });
});

router.get("/projects",helper.checkLogin(),function(req,res) {
  if(req.user.Role == 3){
    Project.find({},function(err,projects){
      res.render("panel/projects",{
        projects:projects
      });
    });
  }else{
    Project.find({"AdminID":{"$in":[req.user._id]}},function(err,projects){
      res.render("panel/projects",{
        projects:projects
      });
    });
  }
});

router.get("/groups",helper.checkLogin(),function(req,res) {
  if(req.user.Role==3){
    Group.find({},function(err,groups){
      res.render("panel/groups",{
        groups:groups
      });
    });
  }else{
    Group.find({"AdminID":{"$in":[req.user._id]}},function(err,groups){
      res.render("panel/groups",{
        groups:groups
      });
    });
  }
});


router.get("/users",helper.checkLogin(),function(req,res) {
  if(req.user.Role==3){
    User.find({},function(err,users){
      res.render("panel/users",{
        users:users
      });
    });
  }else{
    res.redirect("back");
  }
});

router.get("/abouts",helper.checkLogin(),function(req,res) {
  if(req.user.Role == 3){
    res.render("panel/about",{
    });
  }
});

function find_project(){

}

module.exports = router;
