var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Activity = require("../model/Activity");

router.get("/", function(req,res) {
  Activie.find({},function(err,activity){
    res.send({
      me:req.user,
      activity:activity
    });
  });
});

router.post("/create",helper.checkLogin(),function(req,res) {
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

router.post("/update/:id",helper.checkLogin(),function(req,res) {
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

router.post("/delete/:id",helper.checkLogin(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!==-1){
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

router.post("/join",helper.checkLogin(),function(req,res) {
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

router.post("/quit",helper.checkLogin(),function(req,res) {
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

router.get("/:id", function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      User.find({ _id:{ $in:activity.MemberID } },["_id","Email","Major","Talent","Description","Website","Role"],function(err,member){
        res.send({
          me:req.user,
          activity:activity,
          comments:comments,
          members:members
        });
      });
    }else{
      res.send({error:"notFound"});
    }
  });
});

module.exports = router;
