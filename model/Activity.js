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

var activitySchema = new Schema({
  Name:{type:String,required:[true,"請輸入活動名稱"],unique:true},
  Type:{type:String,required:[true,"請選擇活動類型"]},
  Description:{type:String,required:[true,"請輸入活動說明"]},
  Time:[{type:String,required:[true,"請選擇活動時間"]}],
  Fee:[Number],
  MemberID:[{type:ObjectId,ref:"User"}],
  AdminID:[{type:ObjectId,ref:"User"}],
  GroupID:[{type:ObjectId,ref:"Group"}],
  CreateAt: { type: Date, default: Date.now }
});

/*
activitySchema.methods.customMethod = function() {
  return this.model("Activity").find();
};
*/

activitySchema.pre("find", function(next) {
  this.start = Date.now();
  next();
});

activitySchema.post("find", function(result) {
  //console.log(JSON.stringify(result,null,4));
  console.log(`Took ${ Date.now() - this.start} millis`);
});

activitySchema.plugin(uniqueValidator,{ message: "Name 已經使用過" });
var Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
