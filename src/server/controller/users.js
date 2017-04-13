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
    res.send({
      me:req.user,
      users:users
    });
  });
});

router.post("/signup", function(req,res) {
  // console.log(req.body);
  var newUser = {
    UserID:req.body.email, // 先設相同
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
      console.log(newUser.UserID + " is create successfully.");
      res.redirect('/')
    }
  });
});

// router.post("/login", function(req,res) {
//   console.log(req.body);
//   var findUser= {
//     UserID:req.body.username, // 先設相同
//     Password:req.body.password,
//   };
//   User.find(findUser,function(err,result){
//     if(err){
//       res.send({error:helper.handleError(err)});
//     }else{
//       //helper.sendEmail(result.Email,"驗證信",`您好請點擊以下連結開通\n\nhttp://localhost/user/emailauth?user=${result.UserID}&id=${result._id}`);
//       console.log(findUser.UserID + " is find successfully.");
//       res.redirect('/')
//     }
//   });
// });



router.post("/auth", function(req, res) {
  User.findOne({UserID:req.body.userid},["UserID","Password"],function(err,user){
    if(user){
      if(user.Password===req.body.password){
        res.cookie("isLogin",1,{maxAge: 60 * 60 * 1000});
        res.cookie("id", user._id,{maxAge: 60 * 60 * 1000});
        // res.send("ok");
        console.log("log in")
      }else{
        res.send({error:"pwError"});
      }
    }else{
      res.send({error:"notFound"});
    }
  });
});

router.get("/fblogin", function(req, res) {
  res.redirect(`https://www.facebook.com/v2.8/dialog/oauth?client_id=${config.fb_id}&scope=email,public_profile&response_type=token&redirect_uri=http://localhost:3000/user/fbcheck`);
});

router.get("/fbcheck", function(req,res) {
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
    res.render("users/fblogin");
  }
});

router.get("/emailauth", function(req, res){
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

router.post("/update",helper.checkLogin(),function(req, res) {
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
  Message.find({ToID:req.user._id,ToIDType:"people"}).populate('PeopleID').exec(function(err,msg){
    res.send({
      me:req.user,
      msg:msg
    });
  });
});

router.post("/msg/send",helper.checkLogin(),function(req,res) {
  var newMsg = new Message({
    FromID:req.user.UserID,
    ToID:req.body.toid,
    Context:req.body.context,
    IsRead:0,
    FromIDType:"people",
    ToIDType:"people",
  });
  newMsg.save(function(err){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
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

router.get("/:id", function(req,res) {
  User.findOne({UserID:req.params.id},["_id","Email","Major","Talent","Description","Website","Role"],function(err,user){
    if(user){
      res.send({
        me:req.user,
        user:user
      });
    }
    else{
      res.send({error:"notFound"});
    }
  });
});


module.exports = router;