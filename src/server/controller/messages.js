var express = require("express");
var router = express.Router();
var Message = require("../model/Message");
var helper = require("../helper");

router.post("/send",helper.checkLogin(),function(req,res) {
  var fromid = "";
  if(req.body.fromtype=="group"){
    fromid=req.body.groupid;
  }
  else{
    fromid=req.user._id;
  }
  var newMsg = new Message({
    FromID:fromid,
    ToID:req.body.toid,
    Context:req.body.context,
    IsRead:0,
    FromIDType:req.body.fromtype,
    ToIDType:req.body.totype,
  });
  newMsg.save(function(err){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  });
});

router.post("/delete/:id",helper.checkLogin(),function(req,res) {
  Message.findById(req.params.id,function(err,msg){
    if(msg){
      msg.remove(function(err){
        res.send("ok");
      });
    }else{
      res.send({error:"notFound"});
    }
  });
});

module.exports = router;
