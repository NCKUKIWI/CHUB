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
var Message = mongoose.model("Message", messageSchema);

module.exports = Message;
