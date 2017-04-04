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
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  });
});

router.post("/upload",upload.any(),function(req,res) {
  res.send("ok");
});

router.get("/edit", function(req,res) {
  res.render("projects/edit",{
    user:req.user
  });
});

router.get("/apply/:id", function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    User.find({ _id:{ $in:project.ApplyID } },function(err,apply){
      res.render("projects/apply",{
        user:req.user,
        apply:apply
      });
    });
  });
});

router.post("/join", function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    project.ApplyID.push(req.body.user_id);
    project.save(function(err) {
      if(err){
        res.send(helper.handleError(err));
      }else{
        res.send("ok");
      }
    });
  });
});

router.post("/quit", function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    project.MemberID = helper.removeFromArray(project.MemberID,req.user._id);
    project.save(function(err) {
      if(err){
        res.send(helper.handleError(err));
      }else{
        res.send("ok");
      }
    });
  });
});

router.post("/addMenmber/:pid/:uid", function(req,res) {
  Project.findById(req.params.pid, function(err, project) {
    project.ApplyID = helper.removeFromArray(project.ApplyID,req.params.uid);
    project.MemberID.push(req.params.uid);
    project.save(function(err) {
      if(err){
        res.send(helper.handleError(err));
      }else{
        res.send("ok");
      }
    });
  });
});

router.post("/delMember/:pid/:uid", function(req,res) {
  Project.findById(req.params.pid, function(err, project) {
    project.MemberID = helper.removeFromArray(project.MemberID,req.params.uid);
    project.save(function(err) {
      if(err){
        res.send(helper.handleError(err));
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
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  });
});

router.post("/comment/update/:id", function(req,res) {
  Comment.findOneAndUpdate({ _id:req.params.id },{Context:req.body.context},function(err,comment){
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

router.post("/delete/:id", function(req,res) {
  Project.remove({ _id:req.params.id }, function (err) {
    res.send("ok");
  });
});

router.get("/:id", function(req,res) {
  Project.findById(req.params.id,function(err,project){
    User.find({ _id:{ $in:project.MemberID } },function(err,members){
      res.render("projects/show",{
        user:req.user,
        project:project,
        members:members
      });
    });
  });
});

module.exports = router;
