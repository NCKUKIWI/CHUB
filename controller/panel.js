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

module.exports = router;