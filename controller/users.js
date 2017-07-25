var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Group = require("../model/Group");
var Project = require("../model/Project");
var Message = require("../model/Message");
var Activity = require("../model/Activity");
var config = require("../config");
var helper = require("../helper");
var bcrypt = require('bcrypt');
var graph = require("fbgraph");
var cacheClear = require("../cache").clear;
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');

var avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/user/${req.user._id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/user/${req.user._id}`);
    }
    cb(null,`${__dirname}/../uploads/user/${req.user._id}`);
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,"avatar.png");
  }
});

var portfolioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/user/${req.user._id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/user/${req.user._id}`);
    }
    cb(null,`${__dirname}/../uploads/user/${req.user._id}`);
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  }
});

var avatarUpload = multer({
  storage: avatarStorage
}).single("avatar");

var portfolioUpload = multer({
  storage: portfolioStorage
}).single("portfolio");

var userInfo = [
  "_id",
  "Email",
  "Name",
  "Major",
  "Skill",
  "Introduction",
  "Location",
  "Role",
  "Link",
  "hasCover",
  "GroupID",
  "ProjectID",
  "ActivityID",
  "portfolio"
];

router.get("/", function(req,res) {
  var query = {
    Skill:(req.query.skill)?(new RegExp(req.query.skill, "i")):undefined,
    Major:(req.query.major)?(new RegExp(req.query.major, "i")):undefined
  }
  var filter = {
    "Role": { $lt:3 },
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
  User.find(filter, userInfo, function(err, users) {
    //之後可能要放入"跟哪些人互通訊息"的欄位進去
    var userfilter = users.filter(function (el) {
      return el.Role != 0
    });
  	res.render("users/index", {
  		users: userfilter,
      id: req.query.id
  	});
  });
});

router.post("/signup",function(req,res) {
  if(req.body.password2==""){
    res.send({error:["請再輸入一次密碼"]});
  }
  else if(req.body.password!=req.body.password2){
    res.send({error:["兩次密碼不一致"]});
  }
  else{
    bcrypt.hash(req.body.password,5,function(err, hash) {
      var newUser = {
        Password:hash,
        Name:"UserName",
        Email:req.body.email,
        Role:0,
        hasCover:0,
        School: {'Name':"[School]", 'StudentID': "[StudentID]"}
      };
      User.create(newUser,function(err,result){
        console.log(result);
        console.log(newUser);
        console.log(err);
        if(err){
          console.log({error:helper.handleError(err)});
          res.send({error:helper.handleError(err)});
        }else{
          helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\n${config.website}/users/emailauth?uid=${result._id}`);
          res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
          res.cookie("id",result._id,{maxAge: 60 * 60 * 1000});
          res.send("ok");
        }
      });
    });
  }
});

router.post("/auth", function(req, res) {
  User.findOne({$or:[{"Email":req.body.email}]},["Password"],function(err,user){
    if(user){
      console.log(user);
      bcrypt.compare(req.body.password,user.Password,function(err,result) {
        if(result==true){
          res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
          res.cookie("id", user._id,{maxAge: 60 * 60 * 1000});
          res.send("ok");
        }else{
          res.send({error:"Password Error"});
        }
      });
    }else{
      res.send({error:"User not found"});
    }
  });
});

router.get("/forgetpw",helper.checkLogin(0),function(req, res) {
  if(req.query.token){
    var id = req.query.token.slice(0,24);
    User.findById(id,["_id","forgetPw"],function(err,user){
      if(user && user.forgetPw == 1){
        res.render("users/editpw",{
          user:user
        });
      }else{
        res.redirect("/");
      }
    });
  }else{
    res.redirect("/");
  }
});

router.post("/forgetpw",function(req, res) {
  User.findOne({$or:[{"Email":req.body.email}]},["_id","Email","CreateAt"],function(err,user){
    if(user){
      user.forgetPw = 1;
      user.save(function(err){
        if(err){
          console.log(err);
          res.send({error:err});
        }
        else{
          var token = user._id.toString() + new Date(user.CreateAt).getTime();
          helper.sendEmail(user.Email,"忘記密碼",`您好請點擊以下更改密碼\n\n${config.website}/users/forgetpw?token=${token}`);
          res.send("ok");
        }
      });
    }else{
      res.send({error:"User not found"});
    }
  });
});

router.post("/editpw",function(req, res) {
  if(!req.user && !req.body.id){
    res.send({error:"User not found"});
  }
  else{
    var id = (req.body.id)?req.body.id:req.user._id;
    if(req.body.password2==""){
      res.send({error:["請再輸入一次密碼"]});
    }
    else if(req.body.password!=req.body.password2){
      res.send({error:["兩次密碼不一致"]});
    }
    else{
      bcrypt.hash(req.body.password,5,function(err, hash) {
        User.update({_id:id},{"Password":hash,"forgetPw":0},function(err){
          if(err){
            console.log(err);
            res.send({error:helper.handleError(err)});
          }
          else{
            res.send("ok");
          }
        });
      });
    }
  }
});

router.post("/avatar/upload",helper.apiAuth(),function(req,res) {
  avatarUpload(req,res,function(err){
    if(err){
      console.log(err);
      res.send({error:err})
    }else{
      User.update({_id:req.user._id},{"hasCover":1},function(err){
        if(err){
          console.log(err);
          res.send({error:err})
        }
        else{
          res.send("ok");
        }
      });
    }
  });
});

router.get("/portfolio/:id",helper.checkLogin(),function(req, res) {
  User.findById(req.params.id,userInfo,function(err,user){
    if(user){
      res.render("users/portfolio",{
        user:user
      });
    }else{
      res.redirect("/");
    }
  });
});

router.post("/portfolio/upload",helper.apiAuth(),function(req,res) {
  portfolioUpload(req,res,function(err){
    if(err){
      console.log(err);
      res.send({error:err})
    }else{
      User.update({_id:req.user._id},{$push:{"portfolio":req.file.originalname}},function(err){
        if(err){
          console.log(err);
          res.send({error:err})
        }
        else{
          res.send("ok");
        }
      });
    }
  });
});

router.delete("/portfolio/delete",helper.apiAuth(),function(req,res) {
  if(req.body.file){
    User.update({_id:req.user._id},{ $pull:{ "portfolio":req.body.file}},function(err){
      if(err){
        console.log(err);
        res.send({error:err});
      }
      else{
        rimraf(`${__dirname}/../uploads/user/${req.user._id}/${req.body.file}`,function(){});
        res.send("ok");
      }
    });
  }
  else{
    res.send("noFileName");
  }
});

router.get("/fblogin",helper.checkLogin(0),function(req, res) {
  res.redirect(`https://www.facebook.com/v2.8/dialog/oauth?client_id=${config.fb_id}&scope=email,public_profile&response_type=code&redirect_uri=${config.website}/users/fbcheck`);
});

router.get("/fbcheck",helper.checkLogin(0),function(req,res) {
  if(req.query.code){
    graph.authorize({
      "client_id": config.fb_id,
      "redirect_uri": config.website+"/users/fbcheck",
      "client_secret": config.fb_secret,
      "code": req.query.code
    }, function (err,result) {
      graph.get(`/me?fields=id,name,email,gender&access_token=${result.access_token}`,function(err,fb){
        User.findOne({Email:fb.email},"_id",function(err,user){
          if(user){
            res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
            res.cookie("id",user._id,{maxAge: 60 * 60 * 1000});
            res.redirect("/");
          }
          else{
            User.create({ Email:fb.email,Name:fb.name,Password:fb.id,Role:0,hasCover:0,Skill:[],Major:"", School:{'Name':"[School]", 'StudentID': "[StudentID]"}}, function (err,result) {
              if (err) console.log(err);
              helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\n${config.website}/users/emailauth?uid=${result._id}`);
              res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
              res.cookie("id",result._id,{maxAge: 60 * 60 * 1000});
              res.redirect("/");
            })
          }
        });
      });
    });
  }
  else{
    res.redirect("/");
  }
});

router.get("/emailauth",helper.checkLogin(0),function(req, res){
  if(req.query.uid){
    User.findOne({_id:req.query.uid},["_id","EmailConfirm"],function(err,user){
      console.log(err);
      if(user){
        console.log(user);
        user.EmailConfirm = true;
        console.log(user);
        user.save(function(err){
          if(err){
            res.send({error:helper.handleError(err)});
          }else{
            res.send("開通成功");
          }
        });
      }else{
        res.redirect("/");
      }
    });
  }else{
    res.redirect("/");
  }
});

router.post("/resendemail",helper.checkLogin(),function(req, res){
  // 先更新mail, 再寄信
  User.findOneAndUpdate({_id:req.user._id},{"Email": req.body.Email},function(err,user){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      cacheClear();
      helper.sendEmail(req.body.Email,"驗證信",`您好請點擊以下連結開通\n\n${config.website}/users/emailauth?uid=${req.body.id}`);
      res.send("ok");
    }
  });
});

router.post("/update",helper.apiAuth(),function(req, res) {
  if(req.body.skill == null) req.body.skill = [];
  // 如果都有填資料, 則設1, 沒有則設0
  var role = 1;
  for(var i in req.body){
    if(req.body[i].toString == "") role = 0;
  }
  // 須知道email使否被驗證過
  // if (!req.user.EmailConfirm) role = 0;

  var updateData = {
    Email: req.body.Email,
    Name: req.body.Name,
    Major: req.body.Major,
    Introduction: req.body.Introduction,
    Skill: req.body.Skill.replace(/\s/g, "").split(","),
    School: {'Name': req.body.School, 'StudentID': req.body.StudentID},
    RecoveryEmail: req.body.RecoveryEmail,
    Role: role
  }
  User.findOneAndUpdate({_id:req.user._id},updateData,function(err,user){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  });
});

router.get("/logout", function(req, res) {
  res.clearCookie("isLogin");
  res.clearCookie("id");
  res.redirect("/");
});

router.post("/msg",helper.apiAuth(),function(req,res) {
  var msgAll = {};
  Message.find({ToUID:req.user._id}).populate("FromUID","_id Name Email Major Talent Description Website Role").populate("FromGID").exec(function(err,toMsg){
    // 整理對方的訊息(step 1)
    Message.msgSorting(toMsg, msgAll, 1, "FromUID");
    Message.find({FromUID:req.user._id}).populate("ToUID","_id Name Email Major Talent Description Website Role").populate("ToGID").exec(function(err,fromMsg){
      // 整理我方的訊息(step 2)
      var msgArr = Message.msgSorting(fromMsg, msgAll, 0, "ToUID");

      res.render("users/msg",{
        toUserID: req.user._id,
        msgArr: msgArr
      });
    });
  });
});

router.delete("/delete/:id",helper.apiAuth(),function(req,res) {
  User.findById(req.params.id,function(err,user){
    if(user){
      if(user._id == req.user._id || req.user.Role == 3 ){
        Message.remove({$or:[{"ToUID":user._id}, {"FromUID":user._id}]},function(err){
          if(err){
            console.log(err);
            res.send({error:err});
          }else{
            Project.update({$or:[{"ApplyID":user._id},{"AdminID":user._id},{"MemberID":user._id}]},{ $pull: { "MemberID":user._id,"AdminID":user._id,"ApplyID":user._id}},{multi:true},function(err){
              if(err){
                console.log(err);
                res.send({error:err});
              }else{
                Group.update({$or:[{"ApplyID":user._id},{"AdminID":user._id},{"MemberID":user._id}]},{ $pull: { "MemberID":user._id,"AdminID":user._id,"ApplyID":user._id}},{multi:true},function(err){
                  if(err){
                    console.log(err);
                    res.send({error:err});
                  }else{
                    rimraf(`${__dirname}/../uploads/user/${req.params.id}`,function () { });
                    user.remove(function(err){
                      res.send("ok");
                    });
                  }
                });
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

router.post("/:id", function(req,res) {
  User.findById(req.params.id,userInfo).populate("GroupID","_id Name").populate("ProjectID","_id Name").populate("ActivityID","_id Name").exec(function(err,user){
    if(user){
      res.render("users/show",{
        user:user
      });
    }else{
      res.send("notFound");
    }
  });
});



module.exports = router;
