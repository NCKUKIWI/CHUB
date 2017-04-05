var express = require("express");
var router = express.Router();
var Comment = require("../model/Comment");

router.post("/create", function(req,res) {
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
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  });
});

router.post("/update/:id", function(req,res) {
  Comment.findOneAndUpdate({ _id:req.params.id },{Context:req.body.context},function(err,comment){
    if(err){
      res.send(helper.handleError(err));
    }else{
      res.send("ok");
    }
  });
});

router.post("/delete/:id", function(req,res) {
  Comment.remove({ _id:req.params.id }, function (err) {
    res.send("ok");
  });
});

module.exports = router;
