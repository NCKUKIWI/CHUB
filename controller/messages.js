var express = require("express");
var router = express.Router();
var helper = require("../helper");
var Message = require("../model/Message");
var helper = require("../helper");

router.post("/send",helper.apiAuth(),function(req,res) {
  var newMsg;
  if(req.body.fromgid){
    if(req.body.togid){
      newMsg = new Message({
        Context:req.body.context,
        IsRead:0,
        FromGID:req.body.fromgid,
        ToGID:req.body.togid
      });
    }else{
      newMsg = new Message({
        ToUID:req.body.touid,
        Context:req.body.context,
        IsRead:0,
        FromGID:req.body.fromgid,
      });
    }
  }
  else{
    if(req.body.togid){
      newMsg = new Message({
        FromUID:req.user._id,
        Context:req.body.context,
        IsRead:0,
        ToGID:req.body.togid
      });
    }else{
      newMsg = new Message({
        FromUID:req.user._id,
        ToUID:req.body.touid,
        Context:req.body.context,
        IsRead:0,
      });
    }
  }
  console.log(req.body);
  console.log(newMsg);
  newMsg.save(function(err){
    if(err){
      res.send({error:helper.handleError(err)});
    }else{
      res.send("ok");
    }
  });
});

router.post("/delete/:id",helper.apiAuth(),function(req,res) {
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


// 把未讀改已讀
router.get("/isread/:id", helper.apiAuth(), function(req,res){
  var id = req.params.id;
  Message.update({'FromUID':id, 'ToUID': req.user._id}, {'IsRead': true}, function(err){
    if(err) console.log('error update isRead!');
    res.send('isRead');
  });
})

module.exports = router;
