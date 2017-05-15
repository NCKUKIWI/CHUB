var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Project = require("../model/Project");
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
      projects:projects
    });
  });
});

router.get("/create",helper.checkLogin(),function(req,res) {
  res.render("projects/create");
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newProject;
  if(req.body.group_id){
    newProject = new Project({
      Name:req.body.name,
      Type:req.body.type,
      Time:req.body.time.split(","),
      Goal:req.body.goal,
      Need:req.body.need.split(","),
      Description:req.body.description,
      MemberID:[req.user._id],
      AdminID:[req.user._id],
      GroupID:req.body.group_id
    });
  }else{
    newProject = new Project({
      Name:req.body.name,
      Type:req.body.type,
      Time:req.body.time.split(","),
      Goal:req.body.goal,
      Need:req.body.need.split(","),
      Description:req.body.description,
      MemberID:[req.user._id],
      AdminID:[req.user._id],
    });
  }
  newProject.save(function(err){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  });
});

router.post("/upload",upload.any(),function(req,res) {
  res.send("ok");
});

router.get("/edit/:id",helper.checkLogin(),function(req,res) {
  Project.findById(req.params.id,function(err,project){
    if( project && project.AdminID.indexOf(req.user._id)!=-1 ){
      res.render("projects/edit",{
        project:project
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
    Time:req.body.time.split(","),
    Goal:req.body.goal,
    Need:req.body.need.split(","),
    Description:req.body.description
  }
  Project.findOneAndUpdate({ _id:req.params.id },updateData,function(err,project){
    if(project){
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
  Project.findById(req.params.id, function(err, project) {
    if(project){
      if(project.AdminID.indexOf(req.user._id)!==-1){
        User.find({ _id:{ $in:project.ApplyID } },["_id","Name","Email","Major","Skill","Description","Website","Role"],function(err,apply){
          res.render("projects/apply",{
            apply:apply,
            project_id:project._id
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

//會員送出申請加入project
router.post("/join",helper.apiAuth(),function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    if(project){
      project.ApplyID.push(req.user._id);
      project.save(function(err) {
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

//會員退出會員或取消申請
router.post("/quit",helper.apiAuth(),function(req,res) {
  Project.findById(req.body.project_id, function(err, project) {
    if(project){
      project.MemberID = helper.removeFromArray(project.MemberID,req.user._id);
      project.ApplyID = helper.removeFromArray(project.ApplyID,req.user._id);
      project.save(function(err) {
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

//給組織管理者批准申請組織的要求
router.post("/:id/addMember/:uid",helper.apiAuth(),function(req,res) {
  Project.findById(req.params.id, function(err, project) {
    if(project){
      project.ApplyID = helper.removeFromArray(project.ApplyID,req.params.uid);
      project.MemberID.push(req.params.uid);
      project.save(function(err) {
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

//給組織管理者刪除會員或申請
router.post("/:id/delMember/:uid",helper.apiAuth(),function(req,res) {
  Project.findById(req.params.id, function(err, project) {
    if(project){
      project.ApplyID = helper.removeFromArray(project.ApplyID,req.params.uid);
      project.MemberID = helper.removeFromArray(project.MemberID,req.params.uid);
      project.save(function(err) {
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
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!==-1 || req.user.role == 3 ){
        project.remove(function(err){
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

router.post("/:id",function(req,res) {
  Project.findById(req.params.id,function(err,project){
    if(project){
      User.find({ _id:{ $in:project.MemberID } },["_id","Name","Email","Major","Talent","Description","Website","Role"],function(err,members){
        res.render("projects/show",{
          project:project,
          members:members
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

module.exports = router;
