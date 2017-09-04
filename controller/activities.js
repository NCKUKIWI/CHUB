var express = require("express");
var router = express.Router();
var helper = require("../helper");
var config = require("../config");
var sha256 = require("sha256");
var Activity = require("../model/Activity");
var Group = require("../model/Group");
var User = require("../model/User");
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');

var coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/activity/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/activity/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/activity/${req.params.id}`);
  },
  filename: function (req, file, cb) {
    cb(null,"logo.png");
  }
});

var photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/activity/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/activity/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/activity/${req.params.id}`);
  },
  filename: function (req, file, cb) {
    var filename = "photo" +new Date().getTime() +".png"
    cb(null,filename);
  }
});

var coverUpload = multer({
  storage: coverStorage
}).single("cover");

var photoUpload = multer({
  storage: photoStorage
}).single("photo");

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
  Activity.find(filter,function(err,activity){
    res.render("activities/index",{
      activity:activity,
      id: req.query.id
    });
  });
});

router.get("/new",helper.checkLogin(),function(req,res) {
  res.render("activities/new");
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newActivity;
  if(req.body.group_id){
    Group.findById(req.body.group_id,function(err,group){
      newActivity = new Activity({
        Name: req.body.Name,
        Type: req.body.Type,
        Fee: req.body.Fee,
        Introduction: req.body.Introduction,
        Time:(req.body.Time)?(req.body.Time.replace(/\s/g, "").replace(/S/g, "/").split(",")):[],
        hasCover:0,
        MemberID: group.AdminID,
        AdminID: group.AdminID,
        GroupID: req.body.group_id,
        Mission: req.body.Mission
      });
    });
    Activity.create(newActivity,function(err,result){
      if(err){
        res.send({error:helper.handleError(err)});
      }else{
        User.update({_id:{ $in:group.AdminID }},{ $push: { "ActivityID":result._id } },function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            res.send(result._id);
          }
        });
      }
    });
  }else{
    newActivity = new Activity({
      Name: req.body.Name,
      Type: req.body.Type,
      Introduction: req.body.Introduction,
      Time:(req.body.Time)?(req.body.Time.replace(/\s/g, "").replace(/S/g, "/").split(",")):[],
      Fee: req.body.Fee,
      Credit: req.body.Credit,
      Role: req.body.Role,
      hasCover:0,
      Status: 1,
      Location: req.body.Location,
      Contributor: (req.body.Contributor)?(req.body.Contributor.replace(/\s/g, "").split(",")):[],
      Mission: req.body.Mission,      
      MemberID:[],
      AdminID:[req.body.admin],
      ProjectID: []
    });
    Activity.create(newActivity,function(err,result){
      if(err){
        console.log(err);
        res.send({error:helper.handleError(err)});
      }else{
        User.update({_id:req.user._id},{ $push: { "ActivityID":result._id } },function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            res.send(result._id);
          }
        });
      }
    });
  }
});

router.post("/upload/:id",helper.apiAuth(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      coverUpload(req,res,function(err){
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
      res.send("notFound");
    }
  });
});

router.get("/photoUpload/:id",helper.checkLogin(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!=-1){
        res.render("activities/photoUpload",{
          activity:activity
        });
      }else{
        res.redirect("back");
      }
    }else{
      res.redirect("back");
    }
  });
});

router.post("/photoUpload/:id",helper.apiAuth(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!=-1){
        photoUpload(req,res,function(err){
          if(err){
            console.log(err);
            res.send({error:err})
          }else{
            activity.Photo.push(`/uploads/activity/${req.params.id}/${req.file.filename}`)
            activity.save(function(err) {
              if(err){
                res.send({error:helper.handleError(err)});
              }else{
                res.send({
                  index: activity.Photo.length - 1,                
                  id: `${req.params.id}`,
                  url: `/uploads/activity/${req.params.id}/${req.file.filename}`});
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

router.delete("/photoUpload/:id/:index",helper.apiAuth(),function(req,res) {
  Activity.findById(req.params.id,function(err,activity){
    if(activity){
      if(activity.AdminID.indexOf(req.user._id)!=-1){
        rimraf(`${__dirname}/..${ activity.Photo[req.params.index] }`,function () { });
        activity.Photo.splice(req.params.index,1);
        activity.save(function(err) {
          if(err){
            console.log(err);
            res.send({error:helper.handleError(err)});
          }else{
            console.log("success");
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
    Name: req.body.Name,
    Type: req.body.Type,
    Introduction: req.body.Introduction,
    Time: (req.body.Time)?(req.body.Time.replace(/\s/g, "").replace(/S/g, "/").split(",")):[],
    Fee: req.body.Fee,
    Credit: req.body.Credit,
    Role: req.body.Role,
    Location: req.body.Location,
    Contributor: (req.body.Contributor)?(req.body.Contributor.replace(/\s/g, "").split(",")):[],
    Mission: req.body.Mission
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
