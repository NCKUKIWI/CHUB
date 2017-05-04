var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Message = require("../model/Message");
var config = require("../config");
var helper = require("../helper");
var graph = require("fbgraph");

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
      filter["$or"].push({i:query[i]});
    }
  }
  if(filter["$or"].length == 0) filter["$or"].push({});
  User.find(filter,["_id","Email","Major","Talent","Description","Website","Role"],function(err,users){
    res.render("users/index",{
      me:req.user,
      users:users
    });
  });
});

router.get("/login",helper.checkLogin(0),function(req,res) {
  res.render("users/login",{
    me:req.user
  });
});

router.get("/signup",helper.checkLogin(0),function(req,res) {
  res.render("users/signup",{
    me:req.user
  });
});

router.post("/signup",function(req,res) {
  var newUser = {
    UserID:req.body.userid,
    Password:req.body.password,
    Name:req.body.username,
    Email:req.body.email,
    Role:0,
  };
  User.create(newUser,function(err,result){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      //helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\nhttp://localhost/user/emailauth?user=${result.UserID}&id=${result._id}`);
      res.send("ok");
    }
  });
});

router.post("/auth", function(req, res) {
  User.findOne({UserID:req.body.userid},["UserID","Password"],function(err,user){
    if(user){
      if(user.Password===req.body.password){
        res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
        res.cookie("id", user._id,{maxAge: 60 * 60 * 1000});
        res.send("ok");
      }else{
        res.send({error:"Password Error"});
      }
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
          User.create({ UserID:fb.id,Name:fb.name,Password:fb.id,Role:0}, function (err,result) {
            if (err) console.log(err);
            helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\nhttp://localhost/user/emailauth?user=${result.UserID}&id=${result._id}`);
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
  var newData = {
    UserID:req.body.userid,
    Email:req.body.email,
    Name:req.body.name,
    Major:req.body.major,
    Talent:req.body.talent.split(","),
    Description:req.body.description,
    Website:req.body.website
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

router.get("/msg",helper.checkLogin(),function(req,res) {
  Message.find({ToUID:req.user._id}).populate("FromUID").populate("FromGID").exec(function(err,msg){
    res.send({
      me:req.user,
      msg:msg
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

router.get("/:id", function(req,res) {
  User.findOne({UserID:req.params.id},["_id","Email","Major","Talent","Description","Website","Role"],function(err,user){
    if(user){
      res.render("users/show",{
        me:req.user,
        user:user
      });
    }else{
      res.redirect("back");
    }
  });
});


module.exports = router;