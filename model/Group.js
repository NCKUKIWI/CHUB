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

var groupSchema = new Schema({
  Name:{type:String,required:[true,"請輸入組織名稱"]},
  Type:{type:String,required:[true,"請選擇組織類型"]},
  MemberID:[{type:ObjectId,ref:"User"}],
  ApplyID:[{type:ObjectId,ref:"User"}],
  AdminID:[{type:ObjectId,ref:"User"}],
  Website:String,
  Description:{type:String,required:[true,"請輸入組織介紹"]},
  CreateAt: { type: Date, default: Date.now }
});

/*
groupSchema.methods.customMethod = function() {
  return this.model("Group").find();
};
*/

groupSchema.pre("find", function(next) {
  this.start = Date.now();
  next();
});

groupSchema.post("find", function(result) {
  console.log(JSON.stringify(result,null,4));
  console.log(`Took ${ Date.now() - this.start} millis`);
});

groupSchema.plugin(uniqueValidator);
var Group = mongoose.model("Group", groupSchema);

module.exports = Group;
