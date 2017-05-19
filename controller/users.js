var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Message = require("../model/Message");
var config = require("../config");
var helper = require("../helper");
var bcrypt = require('bcrypt');
var graph = require("fbgraph");

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
  "portfolio"
];

router.get("/", function(req,res) {
  var query = {
    Talent:req.query.talent,
    Major:req.query.major
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
  User.find(filter, userInfo, function(err, users) {
    //之後可能要放入"跟哪些人互通訊息"的欄位進去
    console.log(users);
  	res.render("users/index", {
  		users: users
  	});
  });
});

router.post("/signup",function(req,res) {
  bcrypt.hash(req.body.password,5,function(err, hash) {
    var newUser = {
      UserID:req.body.userid,
      Password:hash,
      Name:req.body.username,
      Email:req.body.email,
      Role:0,
    };
    User.create(newUser,function(err,result){
      if(err){
        res.send({error:helper.handleError(err)});
      }else{
        helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\nhttp://chub.nckuhub.com/users/emailauth?user=${result.UserID}&id=${result._id}`);
        res.send("ok");
      }
    });
  });
});

router.post("/auth", function(req, res) {
  User.findOne({UserID:req.body.userid},["UserID","Password"],function(err,user){
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

router.get("/fblogin",helper.checkLogin(0),function(req, res) {
  res.redirect(`https://www.facebook.com/v2.8/dialog/oauth?client_id=${config.fb_id}&scope=email,public_profile&response_type=token&redirect_uri=http://localhost:3000/users/fbcheck`);
});

router.get("/fbcheck",helper.checkLogin(0),function(req,res) {
  if(req.query.access_token){
    graph.get(`/me?fields=id,name,email,gender&access_token=${req.query.access_token}`,function(err,fb){
      User.findOne({UserID:fb.id},"_id",function(err,user){
        if(user){
          res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
          res.cookie("id",user._id,{maxAge: 60 * 60 * 1000});
          res.redirect("/");
        }
        else{
          User.create({ Email:fb.email,UserID:fb.id,Name:fb.name,Password:fb.id,Role:0}, function (err,result) {
            if (err) console.log(err);
            //helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\nhttp://localhost/user/emailauth?user=${result.UserID}&id=${result._id}`);
            res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
            res.cookie("id",result._id,{maxAge: 60 * 60 * 1000});
            res.redirect("/");
          })
        }
      });
    });
  }else{
    res.render("users/fbcheck");
  }
});

router.get("/emailauth",helper.checkLogin(0),function(req, res){
  if(req.query.user && req.query.id){
    User.findOne({_id:req.query.id,UserID:req.query.user},["_id","Role"],function(err,user){
      if(user){
        user.Role = 1;
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

router.post("/update",helper.apiAuth(),function(req, res) {
  if(req.body.skill == null) req.body.skill = [];
  var newData = {
    Email: req.body.email,
    Name: req.body.name,
    Major: req.body.major,
    Location: req.body.location,
    Introduction: req.body.introduction,
    Skill: req.body.skill
  }
  User.findOneAndUpdate({_id:req.user._id},newData,function(err,user){
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
    // console.log(toMsg);
    for(var i in toMsg){
      toMsg[i].isOther = 1;
      if(!msgAll.hasOwnProperty(toMsg[i].FromUID._id)){
        msgAll[toMsg[i].FromUID._id] = {};
        msgAll[toMsg[i].FromUID._id].context = [];
        msgAll[toMsg[i].FromUID._id].latestTime = "2017-05-10T17:19:40.520Z";
        msgAll[toMsg[i].FromUID._id].user = toMsg[i].FromUID;
        msgAll[toMsg[i].FromUID._id].isRead = 0;
      }
      msgAll[toMsg[i].FromUID._id].context.push(toMsg[i]);
      // 暫時別計算未讀
      // if(toMsg[i].IsRead == false) msgAll[toMsg[i].FromUID._id].isRead++;
      if(findLatestTime(toMsg[i].CreateAt, msgAll[toMsg[i].FromUID._id].latestTime)){
        msgAll[toMsg[i].FromUID._id].latestTime = toMsg[i].CreateAt;
      }
    }
    Message.find({FromUID:req.user._id}).populate("ToUID","_id Name Email Major Talent Description Website Role").populate("ToGID").exec(function(err,fromMsg){
      // console.log(fromMsg);
      for(var i in fromMsg){
        fromMsg[i].isOther = 0;
        if(!msgAll.hasOwnProperty(fromMsg[i].ToUID._id)){
          msgAll[fromMsg[i].ToUID._id] = {};
          msgAll[fromMsg[i].ToUID._id].context = [];
          msgAll[fromMsg[i].ToUID._id].latestTime = "2017-05-10T17:19:40.520Z";
          msgAll[fromMsg[i].ToUID._id].user = fromMsg[i].ToUID;
          msgAll[fromMsg[i].ToUID._id].isRead = 0;
        }
        msgAll[fromMsg[i].ToUID._id].context.push(fromMsg[i]);
        if(findLatestTime(fromMsg[i].CreateAt, msgAll[fromMsg[i].ToUID._id].latestTime)){
          msgAll[fromMsg[i].ToUID._id].latestTime = fromMsg[i].CreateAt;
        }
      }
      var msgArr = [];
      // msgAll.sort(function(a,b){
      //   return new Date(a.CreateAt) - new Date(b.CreateAt);
      // });
      for(var i in msgAll){
        msgAll[i].context.sort(function(a, b){
          return new Date(a.CreateAt) - new Date(b.CreateAt);
        })
        msgArr.push(msgAll[i]);
      }
      msgArr.sort(function(a,b){
        return new Date(b.latestTime ) - new Date(a.latestTime);
      });

      // console.log(msgArr);
      res.render("users/msg",{
        toUserID: req.user._id,
        msgArr: msgArr
      });
    });
  });
});

router.post("/loginStatus", function(req,res) {
  if(req.user){
    res.send({
      me:req.user
    });
  }else{
    res.send({error:"notLogin"});
  }
});

// 刪會員需要把其他collection的資料也刪掉，晚點改
router.post("/delete/:id",helper.apiAuth(),function(req,res) {
  User.findById(req.params.id,function(err,user){
    if(user){
      if(user._id = req.user._id || req.user.role == 3 ){
        user.remove(function(err){
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

router.post("/:id", function(req,res) {
  User.findById(req.params.id,function(err,user){
    if(user){
      res.render("users/show",{
        user:user
      });
    }else{
      res.send("notFound");
    }
  });
});

function findLatestTime(a, b){
  return new Date(b) - new Date(a) < 0;
}

module.exports = router;
