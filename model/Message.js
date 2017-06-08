var mongoose = require("./mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
/*
Schema Type
------------
What? => In mongoose
Words => String
True/False => Boolean
Integer => Number
Array => []
Array of String => [String]

Mutiple option
{type: Date , default: Date.now }
{type: String , unique: true, required: true }
{type: String , minlength: 18, maxlength: 65 }
*/

var messageSchema = new Schema({
  FromUID:{type:ObjectId,ref:"User"},
  ToUID:{type:ObjectId,ref:"User"},
  FromGID:{type:ObjectId,ref:"Group"},
  ToGID:{type:ObjectId,ref:"Group"},
  Context:{type:String,required:[true,"請輸入訊息名稱"]},
  IsRead:Boolean,
  CreateAt: { type: Date, default: Date.now }
});

/*
messageSchema.methods.customMethod = function() {
  return this.model("Message").find();
};
*/

messageSchema.pre("find", function(next) {
  this.start = Date.now();
  next();
});

messageSchema.post("find", function(result) {
  // console.log(JSON.stringify(result,null,4));
  console.log(`Took ${ Date.now() - this.start} millis`);
});

messageSchema.plugin(uniqueValidator);

// 過濾訊息，儲存成理想的格式
messageSchema.statics.msgSorting = function(rawMsg, msgAll, isOther, kindOfId){
  for(var i in rawMsg){
    // 為了方便render時分辨對方跟我方的訊息
    if(isOther){
      rawMsg[i].isOther = 1;
    }
    else {
      rawMsg[i].isOther = 0;
    }

    var id = rawMsg[i][kindOfId]._id;
    var userInfo = rawMsg[i][kindOfId];

    if(!msgAll.hasOwnProperty(id)){
      msgAll[id] = {};
      msgAll[id].context = [];
      msgAll[id].latestTime = "2017-05-10T17:19:40.520Z";
      msgAll[id].user = userInfo;
      msgAll[id].isRead = 0;
    }
    msgAll[id].context.push(rawMsg[i]);
    // 暫時別計算未讀
    // if(rawMsg[i].IsRead == false) msgAll[rawMsg[i].FromUID._id].isRead++;
    if(findLatestTime(rawMsg[i].CreateAt, msgAll[id].latestTime)){
      msgAll[id].latestTime = rawMsg[i].CreateAt;
    }
  }

  // 進入第二階段的排序
  if(isOther == 0){
    var msgArr = [];
    for(var i in msgAll){
      msgAll[i].context.sort(function(a, b){
        return new Date(a.CreateAt) - new Date(b.CreateAt);
      })
      msgArr.push(msgAll[i]);
    }
    msgArr.sort(function(a,b){
      return new Date(b.latestTime ) - new Date(a.latestTime);
    });
    return msgArr;
  }
};

function findLatestTime(a, b){
  return new Date(b) - new Date(a) < 0;
}

module.exports = mongoose.model("Message", messageSchema);
