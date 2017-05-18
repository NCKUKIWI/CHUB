var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Activity = require("../model/Activity");
var User = require("../model/User");
var Group = require("../model/Group");
var Project = require("../model/Project");

router.get("/", function(req,res) {
  res.render("panel/index",{
  });
});

router.get("/projects",function(req,res) {
  if(req.user.Role == 3){
    Project.find({},function(err,projects){
      res.render("panel/project",{
        projects:projects
      });
    });
  }else{
    Project.find({"AdminID":{"$in":[req.user._id]}},function(err,projects){
      res.render("panel/project",{
        projects:projects
      });
    });
  }
});

router.get("/groups",function(req,res) {
  if(req.user.Role==3){
    Group.find({},function(err,groups){
      res.render("panel/group",{
        groups:groups
      });
    });
  }else{
    Group.find({"AdminID":{"$in":[req.user._id]}},function(err,groups){
      res.render("panel/group",{
        groups:groups
      });
    });
  }
});

module.exports = router;
