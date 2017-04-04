var express = require("express");
var router = express.Router();
var Activity = require("../model/Activity");


router.get("/", function(req,res) {
  Activie.find({},function(err,activity){
    res.render("activities/index",{
      user:req.user,
      activity:activity
    });
  });
});

router.get("/new", function(req,res) {
  res.render("activities/new",{
    user:req.user
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

router.post("/comment/create", function(req,res) {
  var newComment = new Comment({
    ActivityID:req.body.activity_id,
    Context:req.body.context,
    PeopleID:req.user._id
  });
  newComment.save(function(err){
    if(err){
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  });
});

router.post("/comment/delete/:id", function(req,res) {
  Comment.remove({ _id:req.params.id }, function (err) {
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
    activity.MemberID = helper.removeFromArray(activity.MemberID,req.user._id);
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
    User.find({ _id:{ $in:activity.MemberID } },function(err,members){
      res.render("activities/show",{
        user:req.user,
        activity:activity,
        members:members
      });
    });
  });
});

module.exports = router;
