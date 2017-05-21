var express = require("express");
var router = express.Router();
var helper = require("../helper");
var User = require("../model/User");
var Group = require("../model/Group");
var cacheClear = require("../cache").clear;
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/group/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/group/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/group/${req.params.id}`);
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,"logo.png");
  }
});

var upload = multer({
  storage: storage
}).single("cover");

router.get("/", function(req,res) {
  Group.find({},function(err,groups){
    res.render("groups/index",{
      groups:groups
    });
  });
});

router.get("/new",helper.checkLogin(),function(req,res) {
  res.render("groups/create");
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
  Group.create(newGroup,function(err,result){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      User.update({_id:req.user._id},{$push:{"GroupID":result._id}},function(err){
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
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!=-1){
        upload(req,res,function(err){
          if(err){
            console.log(err);
            res.send({error:err})
          }else{
            res.send("ok");
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
  Group.findById(req.params.id,function(err,group){
    if( group && (group.AdminID.indexOf(req.user._id)!=-1 || req.user.Role==3)){
      res.render("groups/edit",{
        group:group
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
    Website:req.body.website,
    Description:req.body.description
  }
  Group.findOneAndUpdate({ _id:req.params.id },updateData,function(err,group){
    if(group){
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

router.get("/:id/apply",helper.checkLogin(),function(req,res) {
  Group.findById(req.params.id, function(err, group) {
    if(group && (group.AdminID.indexOf(req.user._id)!==-1 || req.user.Role==3)){
      User.find({ _id:{ $in:group.ApplyID } },["_id","Name","Email","Major","Talent","Description","Website","Role"],function(err,apply){
        res.render("groups/apply",{
          apply:apply,
          group_id:group._id
        });
      });
    }
    else{
      res.redirect("back");
    }
  });
});


router.post("/join",helper.apiAuth(),function(req,res) {
  Group.findById(req.body.group_id, function(err, group) {
    if(group){
      if(group.ApplyID.indexOf(req.user._id)==-1 && group.MemberID.indexOf(req.user._id)==-1){
        group.ApplyID.push(req.user._id);
        group.save(function(err) {
          if(err){
            res.send({error:helper.handleError(err)});
          }else{
            cacheClear();
            res.send("ok");
          }
        });
      }
      else{
        res.send({error:"Already join"});
      }
    }else{
      res.send({error:"notFound"});
    }
  });
});

router.post("/quit",helper.apiAuth(),function(req,res) {
  Group.findById(req.body.group_id, function(err, group) {
    if(group){
      group.ApplyID = helper.removeFromArray(group.ApplyID,req.params.uid);
      group.MemberID = helper.removeFromArray(group.MemberID,req.params.uid);
      group.save(function(err) {
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

router.post("/:id/addMember/:uid",helper.apiAuth(),function(req,res) {
  Group.findById(req.params.id, function(err, group) {
    if(group){
      group.ApplyID = helper.removeFromArray(group.ApplyID,req.params.uid);
      group.MemberID.push(req.params.uid);
      group.save(function(err) {
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

router.post("/:id/delMember/:uid",helper.apiAuth(),function(req,res) {
  Group.findById(req.params.id, function(err, group) {
    if(group){
      group.ApplyID = helper.removeFromArray(group.ApplyID,req.params.uid);
      group.MemberID = helper.removeFromArray(group.MemberID,req.params.uid);
      group.save(function(err) {
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

router.delete("/delete/:id",helper.apiAuth(),function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!=-1 || req.user.Role == 3 ){
        group.remove(function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            rimraf(`${__dirname}/../uploads/group/${req.params.id}`,function () { });
            User.update({"GroupID":req.params.id},{$pull:{"GroupID":req.params.id}},function(err){
              if(err){
                console.log(err);
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

router.get("/:id/msg",helper.checkLogin(),function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!==-1){
        Message.find({ToGID:req.params.id}).populate("FromUID","_id Email Major Talent Description Website Role").populate("FromGID").exec(function(err,msg){
          res.render("groups/msg",{
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

router.post("/:id",function(req,res) {
  Group.findById(req.params.id,function(err,group){
    console.log(group);
    if(group){
      User.find({ _id:{ $in:group.MemberID } },["_id","Name","Email","Major","Talent","Description","Website","Role"],function(err,members){
        res.render("groups/show",{
          group:group,
          members:members
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

module.exports = router;
