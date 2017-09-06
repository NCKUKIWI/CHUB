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

var projectSchema = new Schema({
  Name:{type:String,required:[true,"請輸入專案名稱"],unique:true},
  Type:{type:String,required:[true,"請選擇專案類型"]},
  Time:{type:[String],required:[true,"請選擇專案時間"]},
  Photo:[String],
  Location:String,
  Mission:String,
  Need:[String],
  Sponser:[String],
  hasCover:Number,
  Status:Number,
  BigTitle: [],
  SmallTitle: [],
  Introduction:{type:String,required:[true,"請輸入專案介紹"]},
  ApplyID:[{type:ObjectId,ref:"User"}],
  MemberID:[{type:ObjectId,ref:"User"}],
  AdminID:[{type:ObjectId,ref:"User"}],
  GroupID:{type:ObjectId,ref:"Group"},
  ActivityID:{type:ObjectId,ref:"Activity"},
  CreateAt: { type: Date, default: Date.now }
});

/*
projectSchema.methods.customMethod = function() {
  return this.model("Project").find();
};
*/

projectSchema.pre("find", function(next) {
  this.start = Date.now();
  next();
});

projectSchema.post("find", function(result) {
  //console.log(JSON.stringify(result,null,4));
  console.log(`Model project took ${ Date.now() - this.start} millis`);
});

projectSchema.plugin(uniqueValidator,{ message: "Name 已經使用過" });
var Project = mongoose.model("Project", projectSchema);

module.exports = Project;
