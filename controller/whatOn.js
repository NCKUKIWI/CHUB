var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Project = require("../model/Project");
var Activity = require("../model/Activity");
var Group = require("../model/Group");
var User = require("../model/User");
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');
var MobileDetect = require('mobile-detect');

// router.get("/",function(req,res){
// 	var device = new MobileDetect(req.headers['user-agent']);
// 	if(!device.mobile()){
// 		res.render("index");
// 	}
// 	else{
// 		res.render("mobile/whatOn/index");
// 	}
  
// });

router.get("/",function(req,res) {
	var device = new MobileDetect(req.headers['user-agent']);
  var result = {
  };
  Project.find({}).exec().then(function(projects){
    result.projects = projects;
    return Activity.find({}).exec()
  }).then(function(activities){
    result.activities = activities;
		if(!device.mobile()){
			res.render("index", result);
		}
		else{
			res.render("mobile/whatOn/index", result);
		}
  })
  
});

module.exports = router;