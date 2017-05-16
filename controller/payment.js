var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var User = require("../model/User");
var Activity = require("../model/Activity");
var sha256 = require("sha256");

router.get("/return", function(req,res) {
  console.log(req.body);
  console.log("------");
  console.log(req.query);
  console.log("------");
  console.log(req.params);
  res.send("ok");
});

router.post("/return", function(req,res) {
  console.log(req.body);
  console.log("------");
  console.log(req.query);
  console.log("------");
  console.log(req.params);
  res.send("ok");
});

router.get("/notify", function(req,res) {
  console.log(req.body);
  console.log("------");
  console.log(req.query);
  console.log("------");
  console.log(req.params);
  res.send("ok");
});

router.post("/notify", function(req,res) {
  console.log(req.body);
  console.log("------");
  console.log(req.query);
  console.log("------");
  console.log(req.params);
  res.send("ok");
});

module.exports = router;
