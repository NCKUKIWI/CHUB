var express = require("express");
var router = express.Router();
var helper = require("../helper");
var User = require("../model/User");
var Activity = require("../model/Activity");

router.get("/", function(req,res) {
  res.send("payment");
});

module.exports = router;
