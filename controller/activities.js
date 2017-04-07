var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Activity = require("../model/Activity");
var Comment = require("../model/Comment");

router.get("/", function(req,res) {
  Activie.find({},function(err,activity){
    res.send({
      me:req.user,
      activity:activity
    });
  });
});

router.get("/create",helper.checkLogin(),function(req,res) {
  var newActivity = new Activity({
    Name:req.body.name,
    Type:req.body.type,
    Description:req.body.description,
    Time:req.body.time,
    MemberID:[req.user._id],
    AdminID:[req.user._id],
    Context:req.body.context
  });
  newActivity.save(function(err){
    if(err){
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  })
});

router.post("/delete/:id",helper.checkLogin(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!==-1){
        activity.remove(function(err){
          res.send("ok");
        });
      }else{
        res.send("notAdmin");
      }
    }else{
      res.send("notFound");
    }
  });
});

router.post("/join",helper.checkLogin(),function(req,res) {
  Activity.findById(req.body.activity_id, function(err, activity) {
    if(activity){
      activity.MemberID.push(req.body.user_id);
      activity.save(function(err) {
        if(err){
          res.send(helper.handleError(err));
        }else{
          res.send("ok");
        }
      });
    }else{
      res.send("notFound");
    }
  });
});

router.post("/quit",helper.checkLogin(),function(req,res) {
  Activity.findById(req.body.activity_id, function(err, activity) {
    if(activity){
      activity.MemberID = helper.removeFromArray(activity.MemberID,req.body.user_id);
      activity.save(function(err) {
        if(err){
          res.send(helper.handleError(err));
        }else{
          res.send("ok");
        }
      });
    }
    else{
      res.send("notFound");
    }
  });
});

router.get("/:id", function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      Comment.find({ActivityID:activity._id}).populate('PeopleID').exec(function(err,comments){
        User.find({ _id:{ $in:activity.MemberID } },["_id","Email","Major","Talent","Description","Website","Role"],function(err,member){
          res.send({
            me:req.user,
            activity:activity,
            comments:comments,
            members:members
          });
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

module.exports = router;
