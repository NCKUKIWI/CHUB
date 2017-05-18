var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var User = require("../model/User");
var Activity = require("../model/Activity");
var sha256 = require("sha256");

router.get("/return", function(req,res) {
  res.send("付款成功");
});

router.post("/notify", function(req,res) {
  console.log(req.body);
  res.send("ok");
});

module.exports = router;
