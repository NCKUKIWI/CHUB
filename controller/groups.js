var express = require("express");
var router = express.Router();
var helper = require("../helper");
var User = require("../model/User");
var Group = require("../model/Group");
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');
var Message = require("../model/Message");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/group/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/group/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/group/${req.params.id}`);
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
  var query = {
    Type:(req.query.type)?(new RegExp(req.query.type, "i")):undefined
  }
  var filter = {
    $or:[]
  };
  for(var i in query){
    if(query[i]!== undefined){
      var queryobj = {};
      queryobj[i] = query[i];
      filter["$or"].push(queryobj);
    }
  }
  if(filter["$or"].length == 0) filter["$or"].push({});
  Group.find(filter,function(err,groups){
    res.render("groups/index",{
      groups:groups,
      id: req.query.id
    });
  });
});

router.get("/new",helper.checkLogin(),function(req,res) {
  res.render("groups/new");
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newGroup = new Group({
    Name:req.body.name,
    Type:req.body.type,
    MemberID:[req.user._id],
    AdminID:[req.user._id],
    Website:req.body.website,
    hasCover:0,
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
            group.hasCover = 1;
            group.save(function(err){
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
      User.find({ _id:{ $in:group.ApplyID } },["_id","Name","Email","Major","Skill","Description","Website","Role"],function(err,apply){
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
      if(group.MemberID.length==1){
        group.remove(function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            rimraf(`${__dirname}/../uploads/group/${req.body.group_id}`,function () { });
            User.update({"GroupID":req.body.group_id},{$pull:{"GroupID":req.body.group_id}},function(err){
              if(err){
                console.log(err);
                res.send({error:err});
              }else{
                res.send("ok");
              }
            });
          }
        });
      }else{
        group.ApplyID = helper.removeFromArray(group.ApplyID,req.params.uid);
        group.MemberID = helper.removeFromArray(group.MemberID,req.params.uid);
        group.save(function(err) {
          if(err){
            res.send({error:helper.handleError(err)});
          }else{
            res.send("ok");
          }
        });
      }
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
      group.ApplyID = helper.removeFromArray(group.ApplyID,req.params.uid);
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
        var msgAll = {};
        Message.find({ToGID:req.params.id}).populate("FromUID","_id Email Major Talent Description Website Role").populate("FromGID").exec(function(err,msg){
          Message.msgSorting(msg, msgAll, 1, "FromUID");
          Message.find({FromUID:req.params.id}).populate("ToGID","_id Email Major Talent Description Website Role").populate("FromGID").exec(function(err,msg){
            var msgArr = Message.msgSorting(msg, msgAll, 0, "TOGID");
            console.log(msgArr);
            res.render("groups/msg",{
              toGroupID: req.params.id,
              msgArr: msgArr
            });
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

router.get("/:id/projects/new",helper.checkLogin(),function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!==-1 || req.user.Role==3){
        res.render("projects/create",{
          group_id:req.params.id
        });
      }else{
        res.redirect("back");
      }
    }else{
      res.redirect("back");
    }
  });
});

router.get("/:id/activities/new",helper.checkLogin(),function(req,res) {
  Group.findById(req.params.id,function(err,group){
    if(group){
      if(group.AdminID.indexOf(req.user._id)!==-1 || req.user.Role==3){
        res.render("activities/create",{
          group_id:req.params.id
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
  // 要關聯管理員、project、activity，並且避免管理員被選進member
  Group.findById(req.params.id).populate("GroupID","_id Name").populate("ProjectID","_id Name").populate("ActivityID","_id Name").exec(function(err,group){
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
