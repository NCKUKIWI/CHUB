var express = require("express");
var router = express.Router();
var Activity = require("../model/Activity");
var Comment = require("../model/Comment");

router.get("/", function(req,res) {
  Activie.find({},function(err,activity){
    res.send({
      user:req.user,
      activity:activity
    });
  });
});

router.get("/create", function(req,res) {
  var newActivity = new Activity({
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

router.post("/delete/:id", function(req,res) {
  Activity.remove({_id:req.params.id},function(err){
    res.send("ok");
  });
});

router.post("/join", function(req,res) {
  Activity.findById(req.body.activity_id, function(err, activity) {
    activity.MemberID.push(req.body.user_id);
    activity.save(function(err) {
      if(err){
        res.send(helper.handleError(err));
      }else{
        res.send("ok");
      }
    });
  });
});

router.post("/quit", function(req,res) {
  Activity.findById(req.body.activity_id, function(err, activity) {
    activity.MemberID = helper.removeFromArray(activity.MemberID,req.body.user_id);
    activity.save(function(err) {
      if(err){
        res.send(helper.handleError(err));
      }else{
        res.send("ok");
      }
    });
  });
});

router.get("/:id", function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    Comment.find({ActivityID:activity._id},function(err,comment){
      User.find({ _id:{ $in:activity.MemberID } },function(err,member){
        res.send({
          user:req.user,
          activity:activity,
          comment:comment,
          members:members
        });
      });
    });
  });
});

module.exports = router;
