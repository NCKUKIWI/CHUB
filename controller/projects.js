var express = require("express");
var router = express.Router();
var Project = require("../model/Project");
var Comment = require("../model/Comment");
var User = require("../model/User");

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,`./upload/${req.user._id}`);
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
    res.render("projects/index",{
      user:req.user,
      projects:projects
    });
  });
});

router.get("/new", function(req,res) {
  res.render("projects/new",{
    user:req.user
  });
});

router.post("/create", function(req,res) {
  var newProject = new Project({
    Type:req.body.type,
    Time:req.body.time,
    Goal:req.body.goals,
    Need:req.body.need.split(","),
    Description:req.body.description,
    MemberID:[req.user._id],
    AdminID:[req.user._id]
  });
  newProject.save(function(err){
    if(err){
      var errmsg =[];
      for(var i in err.errors){
        errmsg.push(err.errors[i].message);
      }
      res.send(errmsg);
    }else{
      res.send("ok");
    }
  });
});

router.get("/edit", function(req,res) {
  res.render("projects/edit",{
    user:req.user
  });
});

router.post("/addMenmber", function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    project.MemberID.push(req.body.user_id);
    project.save(function(err) {
      if(err){
        var errmsg =[];
        for(var i in err.errors){
          errmsg.push(err.errors[i].message);
        }
        res.send(errmsg);
      }else{
        res.send("ok");
      }
    });
  });
});

router.post("/delMember", function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    var index = project.MemberID.indexOf(req.body.user_id);
    project.MemberID.splice(index,1);
    project.save(function(err) {
      if(err){
        var errmsg =[];
        for(var i in err.errors){
          errmsg.push(err.errors[i].message);
        }
        res.send(errmsg);
      }else{
        res.send("ok");
      }
    });
  });
});

router.post("/comment/create", function(req,res) {
  var newComment = new Comment({
    ProjectID:req.body.project_id,
    Context:req.body.context,
    PeopleID:req.user._id
  });
  newComment.save(function(err){
    if(err){
      var errmsg =[];
      for(var i in err.errors){
        errmsg.push(err.errors[i].message);
      }
      res.send(errmsg);
    }else{
      res.send("ok");
    }
  });
});

router.post("/comment/delete", function(req,res) {
  Comment.remove({ _id:req.body.comment_id }, function (err) {
    res.send("ok");
  });
});

router.get("/:id", function(req,res) {
  Project.findOne({_id:req.params.id},function(err,project){
    User.find({ _id:{ $in:project.MemberID } },function(members){
      res.render("projects/show",{
        user:req.user,
        project:project,
        members:members
      });
    });
  });
});


module.exports = router;
