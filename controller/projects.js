var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Project = require("../model/Project");
var Group = require("../model/Group");
var User = require("../model/User");
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');

var coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/project/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/project/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/project/${req.params.id}`);
  },
  filename: function (req, file, cb) {
    cb(null,"logo.png");
  }
});

var photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/project/${req.params.id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/project/${req.params.id}`);
    }
    cb(null,`${__dirname}/../uploads/project/${req.params.id}`);
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
  var needArr;
  if(req.query.need != undefined) needArr = req.query.need.split(',');
  for(var i in needArr){
    needArr[i] = (new RegExp(needArr[i], "i"));
  }
  var query = {
    Need:(req.query.need)?{'$in': needArr}:undefined,
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
  Project.find(filter,function(err,projects){
    res.render("projects/index",{
      projects:projects,
      id: req.query.id
    });
  });
});

router.get("/new",helper.checkLogin(),function(req,res) {
  res.render("projects/new");
});

router.post("/create",helper.apiAuth(),function(req,res) {
  var newProject;
  if(req.body.group_id){
    Group.findById(req.body.group_id,function(err,group){
      newProject = new Project({
        Name:req.body.Name,
        Type:req.body.Type,
        Time:(req.body.Time)?(req.body.Time.replace(/\s/g, "").split(",")):[],
        Mission:req.body.mission,
        Need:(req.body.Need)?(req.body.Need.replace(/\s/g, "").split(",")):[],
        BigTitle: req.body.BigTitle,
        SmallTitle: req.body.SmallTitle,
        Introduction:req.body.Introduction,
        Location: req.body.Location,
        hasCover:0,
        Status:0,
        // MemberID:group.AdminID,
        AdminID:group.AdminID,
        GroupID:req.body.group_id // 這邊還要討論要怎麼選擇group_id在創立project的時候
      });
      Project.create(newProject,function(err,result){
        if(err){
          res.send({error:helper.handleError(err)});
        }else{
          User.update({_id:{ $in:group.AdminID } },{ $push: { "ProjectID":result._id, "Role": 2} },function(err){
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
  }else{
    newProject = new Project({
      Name:req.body.Name,
      Type:req.body.Type,
      Time:(req.body.Time)?(req.body.Time.replace(/\s/g, "").split(",")):[],
      Mission:req.body.Mission,
      Need:(req.body.Need)?(req.body.Need.replace(/\s/g, "").split(",")):[],
      Introduction:req.body.Introduction,
      BigTitle: req.body.BigTitle,
      SmallTitle: req.body.SmallTitle,
      Location: req.body.Location,
      hasCover:0,
      Status:0,
      // MemberID:[req.user._id],
      AdminID:[req.body.Admin],
    });
    Project.create(newProject,function(err,result){
      if(err){
        console.log(err);
        res.send({error:helper.handleError(err)});
      }else{
        User.update({_id:req.body.admin},{ $push: { "ProjectID":result._id } },function(err){
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
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!=-1 || req.user.Role == 3){
        coverUpload(req,res,function(err){
          if(err){
            console.log(err);
            res.send({error:err})
          }else{
            project.hasCover = 1;
            project.save(function(err){
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

router.get("/photoUpload/:id",helper.checkLogin(),function(req,res) {
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!=-1 || req.user.Role == 3){
        res.render("projects/photoUpload",{
          project:project
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
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!=-1 || req.user.Role == 3){
        photoUpload(req,res,function(err){
          if(err){
            console.log(err);
            res.send({error:err})
          }else{
            project.Photo.push(`/uploads/project/${req.params.id}/${req.file.filename}`)
            project.save(function(err) {
              if(err){
                res.send({error:helper.handleError(err)});
              }else{
                res.send({
                  index: project.Photo.length - 1,                
                  id: `${req.params.id}`,
                  url: `/uploads/project/${req.params.id}/${req.file.filename}`});
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
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!=-1 || req.user.Role == 3){
        rimraf(`${__dirname}/..${ project.Photo[req.params.index] }`,function () { });
        project.Photo.splice(req.params.index,1);
        project.save(function(err) {
          if(err){
            res.send({error:helper.handleError(err)});
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
  Project.findById(req.params.id,function(err,project){
    if( project && (project.AdminID.indexOf(req.user._id)!=-1 || req.user.Role==3 ) ){
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
    Name:req.body.Name,
    Type:req.body.Type,
    Time:req.body.Time.replace(/\s/g, "").split(","),
    Mission:req.body.Mission,
    Need:req.body.Need.replace(/\s/g, "").split(","),
    Location: req.body.Location,
    BigTitle: req.body.BigTitle,
    SmallTitle: req.body.SmallTitle,
    Introduction:req.body.Introduction
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
    if(project && project.AdminID.indexOf(req.user._id)!==-1 || req.user.Role == 3){
      User.find({ _id:{ $in:project.ApplyID } },["_id","Name","Email","Major","Skill","Description","Website","Role"],function(err,apply){
        res.render("projects/apply",{
          apply:apply,
          project_id:project._id
        });
      });
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
      if(project.MemberID.length==1){
        project.remove(function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            rimraf(`${__dirname}/../uploads/project/${req.body.project_id}`,function () { });
            User.update({"ProjectID":req.body.project_id},{$pull:{"ProjectID":req.body.project_id}},function(err){
              if(err){
                res.send({error:err});
              }else{
                res.send("ok");
              }
            });
          }
        });
      }else{
        project.MemberID = helper.removeFromArray(project.MemberID,req.user._id);
        project.ApplyID = helper.removeFromArray(project.ApplyID,req.user._id);
        project.save(function(err) {
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
          // 更新user
          User.findById(req.params.uid, function(err, user) {
            if(user){
              user.ProjectID.push(req.params.id);
              user.save();
              res.send('ok');
            }else{
              res.send({error:"notFound"});
            }
          });
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
          // 更新user
          User.findById(req.params.uid, function(err, user) {
            if(user){
              user.ProjectID = helper.removeFromArray(user.ProjectID,req.params.id);
              user.save();
              res.send('ok');
            }else{
              res.send({error:"notFound"});
            }
          });
        }
      });
    }else{
      res.send({error:"notFound"});
    }
  });
});

// //給組織管理者管理會員職位
// router.post("/:id/editMember/:uid/:position",helper.apiAuth(),function(req,res) {
//   User.findById(req.params.uid, function(err, user) {
//     if(user){
//       user.Position.push({'projectid': req.params.id, 'name': req.params.position});
//       user.save(function(err) {
//         if(err){
//           res.send({error:helper.handleError(err)});
//         }else{
//           res.send("ok");
//         }
//       });
//     }else{
//       res.send({error:"notFound"});
//     }
//   });
// });

router.delete("/delete/:id",helper.apiAuth(),function(req,res) {
  Project.findById(req.params.id,function(err,project){
    if(project){
      if(project.AdminID.indexOf(req.user._id)!==-1 || req.user.Role == 3 ){
        project.remove(function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            rimraf(`${__dirname}/../uploads/project/${req.params.id}`,function () { });
            User.update({"ProjectID":req.params.id},{$pull:{"ProjectID":req.params.id}, "Role":2},function(err){
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

// 撈出member, admin(未做）, project資訊
router.post("/:id",function(req,res) {
  if(req.body.page != 'true'){
    Project.findById(req.params.id,function(err,project){
      if(project){
        User.find({ _id:{ $in:project.MemberID } },["_id","Name","Email","Major","Skill","Description","Role"],function(err,members){
          res.render("projects/show",{
            project:project,
            members:members
          });
        });
      }else{
        res.send("notFound");
      }
    });
  }else{
    Project.findById(req.params.id,function(err,projects){
      res.render("projects/index",{
        projects: projects,
        query: req.params.id
      });
    });
  }
});

module.exports = router;
