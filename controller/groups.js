var express = require("express");
var router = express.Router();
var helper = require("../helper");
var User = require("../model/User");
var Group = require("../model/Group");

router.get("/", function(req,res) {
  Group.find({},function(err,groups){
    res.render("groups/index",{
      me:req.user,
      groups:groups
    });
  });
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newGroup = new Group({
    Name:req.body.name,
    Type:req.body.type,
    MemberID:[req.user._id],
    AdminID:[req.user._id],
    Website:req.body.website,
    Description:req.body.description
  });
  newGroup.save(function(err){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  });
});

router.post("/update/:id",helper.apiAuth(),function(req,res) {
  var updateData = {
    Name:req.body.name,
    Type:req.body.type,
    Website:req.body.website,
    Description:req.body.description
  }
  Group.findOneAndUpdate({ _id:req.params.id },updateData,function(err,group){
    if(group){
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

router.get("/:id/apply",helper.checkLogin(),function(req,res) {
  /*
  Group.findById(req.params.id).populate("ApplyID","_id Email Major Talent Description Website Role").exec(function(err,data){
    res.send({data});
  });
  */
  Group.findById(req.params.id, function(err, group) {
    if(group){
      if(group.AdminID.indexOf(req.user._id)!==-1){
        User.find({ _id:{ $in:group.ApplyID } },["_id","Email","Major","Talent","Description","Website","Role"],function(err,apply){
          res.render("groups/show",{
            me:req.user,
            apply:apply
          });
        });
      }
      else{
        res.redirect("back");
      }
    }else{
      res.redirect("back");
    }
  });
});


router.post("/join",helper.apiAuth(),function(req,res) {
  Group.findById(req.body.group_id, function(err, group) {
    if(group){
      group.ApplyID.push(req.user._id);
      group.save(function(err) {
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
  Group.findById(req.body.group_id, function(err, group) {
    if(group){
      group.MemberID = helper.removeFromArray(group.MemberID,req.user._id);
      group.save(function(err) {
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

router.post("/:id/addMember/:uid",helper.apiAuth(),function(req,res) {
  Group.findById(req.params.id, function(err, group) {
    if(group){
      group.ApplyID = helper.removeFromArray(group.ApplyID,req.params.uid);
      group.MemberID.push(req.params.uid);
      group.save(function(err) {
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

router.post("/:id/delMember/:uid",helper.apiAuth(),function(req,res) {
  Group.findById(req.params.id, function(err, group) {
    if(group){
      group.MemberID = helper.removeFromArray(group.MemberID,req.params.uid);
      group.save(function(err) {
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

router.post("/delete/:id",helper.apiAuth(),function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!==-1 || req.user.role == 3 ){
        group.remove(function(err){
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

router.get("/:id/msg",helper.checkLogin(),function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!==-1){
        Message.find({ToGID:req.params.id}).populate("FromUID").populate("FromGID").exec(function(err,msg){
          res.render("groups/msg",{
            me:req.user,
            msg:msg
          });
        });
      }else{
        res.redirect("back");
      }
    }else{
      res.redirect("back");
    }
  });
});

router.get("/:id",function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      User.find({ _id:{ $in:group.MemberID } },["_id","Email","Major","Talent","Description","Website","Role"],function(err,members){
        res.render("groups/show",{
          me:req.user,
          group:group,
          members:members
        });
      });
    }else{
      res.redirect("back");
    }
  });
});



module.exports = router;
