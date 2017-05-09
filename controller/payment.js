var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var User = require("../model/User");
var Activity = require("../model/Activity");
var sha256 = require("sha256");

router.get("/", function(req,res) {
  var timestamp = Date.now();
  var check =`HashKey=${ config.pay2go.hashkey }&Amt=2000&MerchantID=MS11571737&MerchantOrderNo=1212389&TimeStamp=${ timestamp }&Version=1.2&HashIV=${ config.pay2go.hashiv }`;
  check = sha256(check).toUpperCase();
  res.render("payment",{
    timestamp:timestamp,
    check:check
  });
});

router.post("/return", function(req,res) {
  res.send("ok");
});

module.exports = router;
