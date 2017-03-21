var express = require("express");
var router = express.Router();
var User = require('../model/User');
var config = require('../config');
var graph = require("fbgraph");

router.get("/", function(req,res) {
  res.render("users/index");
});

router.post("/signup", function(req,res) {
  var newUser = new User({
    UserID:req.body.userid,
    Password:req.body.pw,
    Name:req.body.name,
    Role:1,
  });
  newUser.save(function(err){
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

router.post("/auth", function(req, res) {
  User.findOne({UserID:req.body.userid},function(err,user){
    if(user){
      if(user.Password===req.body.pw){
        res.cookie('isLogin',1,{maxAge: 60 * 60 * 1000});
        res.cookie('id', user._id,{maxAge: 60 * 60 * 1000});
        res.send("ok");
      }else{
        res.send("fail");
      }
    }else{
      res.send("fail");
    }
  });
});

router.get("/fblogin", function(req, res) {
  res.redirect(`https://www.facebook.com/v2.8/dialog/oauth?client_id=${config.fb_id}&scope=email,public_profile&response_type=token&redirect_uri=http://localhost:3000/user/fbcheck`);
});

router.get("/fbcheck", function(req,res) {
  if(req.query.access_token){
    graph.get(`/me?fields=id,name,email,gender&access_token=${req.query.access_token}`,function(err,fb){
      User.findOne({UserID:fb.id},function(err,user){
        if(user){
          res.cookie('isLogin',1,{maxAge: 60 * 60 * 1000});
          res.cookie('id',user._id,{maxAge: 60 * 60 * 1000});
          res.redirect("/");
        }
        else{
          User.create({ UserID:fb.id,Name:fb.name,Password:fb.id,Role:1}, function (err,result) {
            if (err) console.log(err);
            res.cookie('isLogin',1,{maxAge: 60 * 60 * 1000});
            res.cookie('id',result._id,{maxAge: 60 * 60 * 1000});
            res.redirect("/");
          })
        }
      });
    });
  }else{
    res.render("users/fblogin");
  }
});

router.get("/logout", function(req, res) {
  res.clearCookie('isLogin');
  res.clearCookie('id');
  res.redirect("/");
});

router.get("/:id", function(req,res) {
  res.render("users/show");
});


module.exports = router;
