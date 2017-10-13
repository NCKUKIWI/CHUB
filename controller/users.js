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
var fs = require("fs");
var rimraf = require("rimraf");
var multer  = require('multer');
var MobileDetect = require('mobile-detect');

var avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../uploads/user/${req.user._id}`)){
      fs.mkdirSync(`${__dirname}/../uploads/user/${req.user._id}`);
    }
    cb(null,`${__dirname}/../uploads/user/${req.user._id}`);
  },
  filename: function (req, file, cb) {
    var filename = "avatar" +new Date().getTime() +".png"
    cb(null,filename);
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
  "GroupID",
  "ProjectID",
  "ActivityID",
  "portfolio",
  "Avatar"
];

router.get("/", function(req,res) {
  var query = {
    Skill:(req.query.skill)?(new RegExp(req.query.skill, "i")):undefined,
    Major:(req.query.major)?(new RegExp(req.query.major, "i")):undefined
  }
  var filter = {
    "Role": { $gt:0 }, // 如果role = 0, 不讓他顯示在people上面
    "EmailConfirm": true, // email被認證後，才可以出現在上面
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
  User.find(filter, userInfo).sort({'CreateAt' : -1}).exec(function(err, users) {
  	var device = new MobileDetect(req.headers['user-agent']);
    //之後可能要放入"跟哪些人互通訊息"的欄位進去
    // console.log(users.length);
    // console.log(typeof(users));
    if(!device.mobile()){
	  	res.render("users/index", {
	  		users: users,
	      id: req.query.id
	  	});
	  }else{
      res.render("mobile/users/index",{
	  		users: users,
	      id: req.query.id
      });
	  }
  });
});

// mobile用的
router.get("/id/:id", function(req, res){
  var device = new MobileDetect(req.headers['user-agent']);
  if(!device.mobile()){ return;};
  if(req.body.page != 'true'){
	  User.findById(req.params.id,userInfo).populate("GroupID","_id Name").populate("ProjectID","_id Name").populate("ActivityID","_id Name").exec(function(err,user){
	    if(user){
	      res.render("mobile/users/show",{
	        user:user
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

router.post("/signup",function(req,res) {
  if(req.body.Password2==""){
    res.send({error:["請再輸入一次密碼"]});
  }
  else if(req.body.Password!=req.body.Password2){
    res.send({error:["兩次密碼不一致"]});
  }
  else{
    bcrypt.hash(req.body.Password,5,function(err, hash) {
      console.log(req.body);
      var newUser = {
        Password:hash,
        Email: req.body.Email,
        Name: req.body.Name,
        Major: req.body.Major,
        Introduction: req.body.Introduction,
        Skill: req.body.Skill.split(/\,|\、|\,\s|\s\,|\s\,\s|\，/g),
        School: {'Name': req.body.School, 'StudentID': req.body.StudentID},
        RecoveryEmail: req.body.RecoveryEmail,
        Role: 0,
        Avatar:"newuser",
        //Cellphone: req.body.Cellphone
      };
      if(req.body.FBID !== undefined) newUser.FBID = req.body.FBID;
      User.create(newUser,function(err,result){
        if(err){
          console.log({error:helper.handleError(err)});
          res.send({error:helper.handleError(err)});
        }else{
          helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\n${config.website}/users/emailauth?uid=${result._id}`);
          res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
          res.cookie("id",result._id,{maxAge: 60 * 60 * 1000});
          res.send({"isLogin":1,"id":result._id});
        }
      });
    });
  }
});

router.post("/auth", function(req, res) {
  User.findOne({$or:[{"Email":req.body.email}]},["Password"],function(err,user){
    if(user){
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
      rimraf(`${__dirname}/..${req.user.Avatar}`,function(){});
      var filepath;

      if(req.body.fb !== undefined) filepath = req.body.fb
      else filepath = `/uploads/user/${req.user._id}/${req.file.filename}`;

      console.log(filepath);
      User.update({_id:req.user._id},{"Avatar": filepath},function(err){
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
      graph.get(`/me?fields=id,name,email,picture.type(large)&access_token=${result.access_token}`,function(err,fb){
        User.findOne({FBID:fb.id},"_id",function(err,user){
          if(user){
            res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
            res.cookie("id",user._id,{maxAge: 60 * 60 * 1000});
            res.redirect("/");
          }
          else{
            console.log(fb);
            res.render('index',{
              fb: fb
            });
            // User.create({FBID:fb.id,Email:fb.email,Name:fb.name,Password:fb.id,Role:0,Avatar:fb.picture.data.url,Skill:[],Major:"", School: {'Name':"", 'StudentID': ""}}, function (err,result) {
            //   if (err) console.log(err);
            //   helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\n${config.website}/users/emailauth?uid=${result._id}`);
            //   res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
            //   res.cookie("id",result._id,{maxAge: 60 * 60 * 1000});
            //   res.redirect("/");
            // })
          }
        });
      });
    });
  }
  else{
    res.redirect("/");
  }
});

router.get("/emailauth",function(req, res){
  if(req.query.uid){
    User.findOne({_id:req.query.uid},["_id","Role"],function(err,user){
      if(user && user.EmailConfirm != true ){
        user.EmailConfirm = true;
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
  console.log(req.body);
  User.findOneAndUpdate({_id:req.user._id},{"Email": req.body.Email},function(err,user){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      helper.sendEmail(req.body.Email,"驗證信",`您好請點擊以下連結開通\n\n${config.website}/users/emailauth?uid=${req.user._id}`);
      res.send("ok");
    }
  });
});

router.post("/update",helper.apiAuth(),function(req, res) {
	console.log(req.body);
  if(req.body.Skill == null) req.body.Skill = [];
  // 如果都有填資料, 則設1, 沒有則設0
  var role = 1;
  for(var i in req.body){
    if(req.body[i].toString == "") role = 0;
  }
  // 須知道email使否被驗證過
  if (req.user.EmailConfirm) role == 0;

  var updateData = {
    Email: req.body.Email,
    Major: req.body.Major,
    Introduction: req.body.Introduction,
    Skill: req.body.Skill.split(/\,|\、|\,\s|\s\,|\s\,\s|\，/g),
    //School: {'Name': req.body.School, 'StudentID': req.body.StudentID},
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
  Message.find({ToUID:req.user._id}).populate("FromUID","_id Name Email Major Skill Introduction Website Role").populate("FromGID").exec(function(err,toMsg){
    // 整理對方的訊息(step 1)
    Message.msgSorting(toMsg, msgAll, 1, "FromUID");
    Message.find({FromUID:req.user._id}).populate("ToUID","_id Name Email Major Skill Introduction Website Role").populate("ToGID").exec(function(err,fromMsg){
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
