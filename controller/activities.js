var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var sha256 = require("sha256");
var Activity = require("../model/Activity");
var User = require("../model/User");
var cacheClear = require("../cache").clear;
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/activity/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/activity/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/activity/${req.params.id}`);
  },
  filename: function (req, file, cb) {
    //var fileFormat = (file.originalname).split(".");
    cb(null,"logo.png");
  }
});

var upload = multer({
  storage: storage
}).single("cover");

router.get("/", function(req,res) {
  Activity.find({},function(err,activity){
    res.render("activities/index",{
      activity:activity,
      id: req.query.id
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
      hasCover:0,
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
      hasCover:0,
      MemberID:[req.user._id],
      AdminID:[req.user._id],
      Context:req.body.context
    });
  }
  Activity.create(newActivity,function(err,result){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      User.update({_id:req.user._id},{ $push: { "ActivityID":result._id } },function(err){
        if(err){
          console.log(err);
          res.send({error:err});
        }else{
          cacheClear();
          res.send(result._id);
        }
      });
    }
  });
});

router.post("/upload/:id",helper.apiAuth(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!=-1){
        upload(req,res,function(err){
          if(err){
            console.log(err);
            res.send({error:err})
          }else{
            activity.hasCover = 1;
            activity.save(function(err){
              if(err){
                console.log(err);
                res.send({error:err});
              }
              else{
                res.send("ok");
              }
            });
          }
        });
      }else{
        res.send("notAdmin");
      }
    }else{
      res.send("notFound");
    }
  });
});

router.get("/edit/:id",helper.checkLogin(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if( activity && (activity.AdminID.indexOf(req.user._id)!=-1 || req.user.Role==3)){
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
        cacheClear();
        res.send("ok");
      }
    }else{
      res.send({error:"notFound"});
    }
  });
});

router.delete("/delete/:id",helper.apiAuth(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!==-1 || req.user.Role == 3 ){
        activity.remove(function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            rimraf(`${__dirname}/../uploads/activity/${req.params.id}`,function () { });
            User.update({"ActivityID":req.params.id},{$pull:{"ActivityID":req.params.id}},function(err){
              if(err){
                res.send({error:err});
              }else{
                cacheClear();
                res.send("ok");
              }
            });
          }
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
          cacheClear();
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
          cacheClear();
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
