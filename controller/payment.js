var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var User = require("../model/User");
var Activity = require("../model/Activity");
var sha256 = require("sha256");

router.get("/", function(req,res) {
  var timestamp = Date.now();
  //var check =`HashKey=${ config.pay2go.hashkey }&Amt=2000&MerchantID=PG100000002050&MerchantOrderNo=1212389&TimeStamp=${ timestamp }&Version=1.0&HashIV=${ config.pay2go.hashiv }`;
  //check = sha256(check).toUpperCase();
  var info = `MerchantID=PG100000002050&TimeStamp=${ timestamp }&Version=1.0&MerchantOrderNo=1212389&Amt=2000&ItemDesc=someword`;
  var tradeinfo = helper.encrypt(config.pay2go.hashkey,config.pay2go.hashiv,info).trim();
  var tradesha = `HashKey=${ config.pay2go.hashkey }&${ tradeinfo }&HashIV=${ config.pay2go.hashiv }`;
  tradesha = sha256(tradesha).toUpperCase();
  res.render("payment",{
    timestamp:timestamp,
    tradeinfo:tradeinfo,
    tradesha:tradesha
  });
});

router.post("/return", function(req,res) {
  res.send("ok");
});

module.exports = router;
