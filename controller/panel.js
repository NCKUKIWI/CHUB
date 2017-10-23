var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Activity = require("../model/Activity");
var User = require("../model/User");
var Group = require("../model/Group");
var Project = require("../model/Project");

router.get("/",helper.checkLogin(),function(req,res) {
  var result = {
    openPage: req.query.openPage
  };
  if(req.user.Role == 3){
    Project.find({}).exec().then(function(projects){
      result.projects = projects;
      return User.find({}).exec()
    }).then(function(users){
      result.users = users;
      return Activity.find({}).exec()
    }).then(function(activities){
      result.activities = activities;
      return Group.find({}).exec()
    }).then(function(groups){
      result.groups = groups;
      res.render("panel/index", result);
    })
  }
  else if(req.user.Role == 2){
    Project.find({"AdminID":{"$in":[req.user._id]}},function(err,projects){
      Activity.find({"AdminID":{"$in":[req.user._id]}}, function(err, activities){
        res.render("panel/index",{
          activities: activities,
          groups: groups,
          projects: projects,
          openPage: openPage
        });
      })
    });   
  }
});

router.post("/projectMember/:id",helper.checkLogin(),function(req,res) {
  // if(req.user.Role == 3){
  //   Project.find({},function(err,projects){
  //     res.render("panel/projects",{
  //       projects:projects
  //     });
  //   });
  // }else{
  //   Project.find({"AdminID":{"$in":[req.user._id]}},function(err,projects){
  //     res.render("panel/projects",{
  //       projects:projects
  //     });
  //   });
  // }
  Project.findById(req.params.id,function(err,project){
    if(project){
      User.find({ _id:{ $in:project.MemberID } },["_id","Name","Email","Major","Skill","Description","Role"],function(err,members){
        User.find({ _id:{ $in:project.ApplyID } },["_id","Name","Email","Major","Skill","Description","Role"],function(err,applyer){
          User.find({ _id:{ $in:project.AdminID } },["_id","Name","Email","Major","Skill","Description","Role"],function(err,admins){
            console.log(admins);
            res.render("panel/project_member",{
              project:project,
              members:members,
              applyer: applyer,
              admins: admins
            });
          });
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

router.post("/projectApplying/:id",helper.checkLogin(),function(req,res) {
  // if(req.user.Role == 3){
  //   Project.find({},function(err,projects){
  //     res.render("panel/projects",{
  //       projects:projects
  //     });
  //   });
  // }else{
  //   Project.find({"AdminID":{"$in":[req.user._id]}},function(err,projects){
  //     res.render("panel/projects",{
  //       projects:projects
  //     });
  //   });
  // }
  Project.findById(req.params.id,function(err,project){
    if(project){
      User.find({ _id:{ $in:project.ApplyID } },["_id","Name","Email","Major","Skill","Description","Role"],function(err,members){
        res.render("panel/project_member",{
          project:project,
          members:members
        });
      });
    }else{
      res.send("notFound");
    }
  });
});

// 取得user資料，讓創立的專案可以選擇admin
router.get("/getUsers", helper.checkLogin(), function(req, res){
  User.find({Name: (new RegExp(req.query.name, "i")), "Role": { $gt:0 }},function(err,users){
    var result = [];
    for(var i in users){
      result.push({"name": users[i].Name, "value": users[i]._id, "text": users[i].Name});
    }
    res.send(result);
  });
})

router.get("/groups",helper.checkLogin(),function(req,res) {
  if(req.user.Role==3){
    Group.find({},function(err,groups){
      res.render("panel/groups",{
        groups:groups
      });
    });
  }else{
    Group.find({"AdminID":{"$in":[req.user._id]}},function(err,groups){
      res.render("panel/groups",{
        groups:groups
      });
    });
  }
});


router.get("/users",helper.checkLogin(),function(req,res) {
  if(req.user.Role==3){
    User.find({},function(err,users){
      res.render("panel/users",{
        users:users
      });
    });
  }else{
    res.redirect("back");
  }
});

router.get("/abouts",helper.checkLogin(),function(req,res) {
  if(req.user.Role == 3){
    res.render("panel/about",{
    });
  }
});

router.post("/uploadNewsPhoto"), function(req, res) {
	
}

function find_project(){

}

module.exports = router;
