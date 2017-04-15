var express = require("express");
var router = express.Router();
var Comment = require("../model/Comment");
var helper = require("../helper");

router.post("/create",helper.checkLogin(),function(req,res) {
  if(req.body.project_id || req.body.activity_id){
    if(req.body.project_id){
      var newComment = new Comment({
        ProjectID:req.body.project_id,
        Context:req.body.context,
        PeopleID:req.user._id
      });
    }else{
      var newComment = new Comment({
        ActivityID:req.body.activity_id,
        Context:req.body.context,
        PeopleID:req.user._id
      });
    }
    newComment.save(function(err){
      if(err){
        res.send({error:helper.handleError(err)});
      }else{
        res.send("ok");
      }
    });
  }else{
    res.send({error:"noID"});
  }
});

router.post("/update/:id",helper.checkLogin(),function(req,res) {
  Comment.findOneAndUpdate({ _id:req.params.id },{Context:req.body.context},function(err,comment){
    if(comment){
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

router.post("/delete/:id",helper.checkLogin(),function(req,res) {
  Comment.findById(req.params.id,function(err,comment){
    if(comment){
      if(comment.PeopleID==req.user._id){
        comment.remove(function (err) {
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

module.exports = router;
