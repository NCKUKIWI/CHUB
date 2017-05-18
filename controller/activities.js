var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var sha256 = require("sha256");
var Activity = require("../model/Activity");
var User = require("../model/User");

router.get("/", function(req,res) {
  Activity.find({},function(err,activity){
    res.render("activities/index",{
      activity:activity
    });
  });
});

router.get("/new",helper.checkLogin(),function(req,res) {
  res.render("activities/create");
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newActivity;
  if(req.body.group_id){
    newActivity = new Activity({
      Name:req.body.name,
      Type:req.body.type,
      Fee:[req.body.fee],
      Description:req.body.description,
      Time:req.body.time.split(","),
      MemberID:[req.user._id],
      AdminID:[req.user._id],
      GroupID:req.body.group_id,
      Context:req.body.context
    });
  }else{
    newActivity = new Activity({
      Name:req.body.name,
      Type:req.body.type,
      Fee:[req.body.fee],
      Description:req.body.description,
      Time:req.body.time.split(","),
      MemberID:[req.user._id],
      AdminID:[req.user._id],
      Context:req.body.context
    });
  }
  newActivity.save(function(err){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  })
});

router.get("/edit/:id",helper.checkLogin(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if( activity && activity.AdminID.indexOf(req.user._id)!=-1 ){
      res.render("activities/edit",{
        activity:activity
      });
    }else{
      res.redirect("back");
    }
  });
});

router.post("/update/:id",helper.apiAuth(),function(req,res) {
  var updateData = {
    Name:req.body.name,
    Type:req.body.type,
    Description:req.body.description,
    Time:req.body.time.split(","),
    Context:req.body.context
  }
  Activity.findOneAndUpdate({ _id:req.params.id },updateData,function(err,activity){
    if(activity){
      if(err){
        res.send({error:helper.handleError(err)});
      }else{
        res.send("ok");
      }
    }else{
      res.send({error:"notFound"});
    }
  });
});

router.post("/delete/:id",helper.apiAuth(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!==-1 || req.user.role == 3 ){
        activity.remove(function(err){
          res.send("ok");
        });
      }else{
        res.send({error:"notAdmin"});
      }
    }else{
      res.send({error:"notFound"});
    }
  });
});

router.post("/join",helper.apiAuth(),function(req,res) {
  Activity.findById(req.body.activity_id, function(err, activity) {
    if(activity){
      activity.MemberID.push(req.body.user_id);
      activity.save(function(err) {
        if(err){
          res.send({error:helper.handleError(err)});
        }else{
          res.send("ok");
        }
      });
    }else{
      res.send({error:"notFound"});
    }
  });
});

router.post("/quit",helper.apiAuth(),function(req,res) {
  Activity.findById(req.body.activity_id, function(err, activity) {
    if(activity){
      activity.MemberID = helper.removeFromArray(activity.MemberID,req.body.user_id);
      activity.save(function(err) {
        if(err){
          res.send({error:helper.handleError(err)});
        }else{
          res.send("ok");
        }
      });
    }
    else{
      res.send({error:"notFound"});
    }
  });
});

router.post("/addCalendar/:id",helper.apiAuth(),function(req,res) {
  res.send("add activity to calendar");
});

router.post("/:id", function(req,res) {
  Activity.findById(req.params.id).populate("MemberID","_id Name").exec(function(err,activity){
    if(activity){
      User.find({ _id:{ $in:activity.MemberID } },["_id","Name","Email","Major","Talent","Description","Website","Role"],function(err,members){
        var timestamp = Date.now();
        var orderNo = (activity._id.toString().substr(0, 3)+timestamp).substr(0, 19);
        var check =`HashKey=${ config.pay2go.hashkey }&Amt=${ activity.Fee }&MerchantID=MS11571737&MerchantOrderNo=${ orderNo }&TimeStamp=${ timestamp }&Version=1.2&HashIV=${ config.pay2go.hashiv }`;
        check = sha256(check).toUpperCase();
        res.render("activities/show",{
          activity:activity,
          members:members,
          timestamp:timestamp,
          orderNo:orderNo,
          check:check
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

module.exports = router;
