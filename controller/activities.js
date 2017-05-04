var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Activity = require("../model/Activity");

router.get("/", function(req,res) {
  Activity.find({},function(err,activity){
    res.render("activities/index",{
      me:req.user,
      activity:activity
    });
  });
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newActivity;
  if(req.body.group_id){
    newActivity = new Activity({
      Name:req.body.name,
      Type:req.body.type,
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

router.get("/:id", function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      User.find({ _id:{ $in:activity.MemberID } },["_id","Email","Major","Talent","Description","Website","Role"],function(err,member){
        res.render("activities/show",{
          me:req.user,
          activity:activity,
          members:members
        });
      });
    }else{
      res.redirect("back");
    }
  });
});

module.exports = router;
