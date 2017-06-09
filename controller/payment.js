var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var User = require("../model/User");
var Payment = require("../model/Payment");
var Activity = require("../model/Activity");

router.post("/return", function(req,res) {
  res.send("付款成功");
});

router.post("/notify", function(req,res) {
  var data = JSON.parse(JSON.parse(req.body.JSONData).Result);
  var newPayment = new Payment({
    Amt:data.Amt,
    TradeNo:data.TradeNo,
    MerchantOrderNo:data.MerchantOrderNo,
    PayTime:data.PayTime,
    PaymentType:data.PaymentType,
    EscrowBank:data.EscrowBank
  });
  newPayment.save(function(err){
    if(err){
      console.log(err);
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  });
});

module.exports = router;
