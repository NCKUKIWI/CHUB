var express = require("express");
var router = express.Router();
var Message = require("../model/Message");

router.post("/send",helper.checkLogin(),function(req,res) {
  var newMsg = new Message({
    FromID:req.user._id,
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
