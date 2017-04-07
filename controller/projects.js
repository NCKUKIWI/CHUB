var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Project = require("../model/Project");
var Comment = require("../model/Comment");
var User = require("../model/User");

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,`./upload/${req.body.group_id}`);
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,"project." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({
  storage: storage
});

router.get("/", function(req,res) {
  Project.find({},function(err,projects){
    res.send({
      me:req.user,
      projects:projects
    });
  });
});

router.post("/create",helper.checkLogin(),function(req,res) {
  var newProject = new Project({
    Name:req.body.name,
    Type:req.body.type,
    Time:req.body.time.split(","),
    Goal:req.body.goal,
    Need:req.body.need.split(","),
    Description:req.body.description,
    MemberID:[req.user._id],
    AdminID:[req.user._id]
  });
  newProject.save(function(err){
    if(err){
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  });
});

router.post("/upload",upload.any(),function(req,res) {
  res.send("ok");
});

router.get("/:id/apply",helper.checkLogin(),function(req,res) {
  Project.findById(req.params.id, function(err, project) {
    if(project){
      User.find({ _id:{ $in:project.ApplyID } },function(err,apply){
        res.send({
          me:req.user,
          apply:apply
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

router.post("/join",helper.checkLogin(),function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    if(project){
      project.ApplyID.push(req.user._id);
      project.save(function(err) {
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
  Project.findById(req.body.project_id, function(err, project) {
    if(project){
      project.MemberID = helper.removeFromArray(project.MemberID,req.user._id);
      project.save(function(err) {
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

router.post("/:id/addMember/:uid",helper.checkLogin(),function(req,res) {
  Project.findById(req.params.id, function(err, project) {
    if(project){
      project.ApplyID = helper.removeFromArray(project.ApplyID,req.params.uid);
      project.MemberID.push(req.params.uid);
      project.save(function(err) {
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

router.post("/:id/delMember/:uid",helper.checkLogin(),function(req,res) {
  Project.findById(req.params.id, function(err, project) {
    if(project){
      project.MemberID = helper.removeFromArray(project.MemberID,req.params.uid);
      project.save(function(err) {
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

router.post("/delete/:id",helper.checkLogin(),function(req,res) {
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!==-1){
        project.remove(function(err){
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

router.get("/:id",function(req,res) {
  Project.findById(req.params.id,function(err,project){
    if(project){
      Comment.find({ProjectID:project._id}).populate('PeopleID').exec(function(err,comments){
        User.find({ _id:{ $in:project.MemberID } },["_id","Email","Major","Talent","Description","Website","Role"],function(err,members){
          res.send({
            me:req.user,
            project:project,
            commenst:comments,
            members:members
          });
        });
      });
    }
    else{
      res.send("notFound");
    }
  });
});

module.exports = router;
