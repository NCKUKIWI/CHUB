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

var userSchema = new Schema({
  // UserID: { type:String,required:[true,"請輸入用戶名稱"] ,unique:true }, // 好像已經沒有了
  Email: { type:String,required:[true,"請輸入Email"]},
  EmailConfirm: { type: Boolean, default:false},
  RecoveryEmail: String,
  Password: { type: String, minlength:[8,"密碼需大於8碼"],required:[true,"請輸入密碼"] },
  Name: { type: String,required: [true,"請輸入用戶姓名"] },
  Major: String,
  Skill: [String],
  Location: String,
  Introduction: { type: String, minlength:0, maxlength:100 },
  School: {'Name': String, 'StudentID': String},
  Link: [String],
  Role: Number,
  hasCover:Number,
  forgetPw:Number,
  GroupID: [{type:ObjectId,ref:"Group"}],
  ProjectID: [{type:ObjectId,ref:"Project"}],
  ActivityID: [{type:ObjectId,ref:"Activity"}],
  portfolio: [String],
  CreateAt: { type: Date, default: Date.now }
});

/*
userSchema.methods.customMethod = function() {
  return this.model("User").find();
};
*/

userSchema.pre("find", function(next) {
  this.start = Date.now();
  next();
});

userSchema.post("find", function(result) {
  //console.log(JSON.stringify(result,null,4));
  console.log(`Modal user took ${ Date.now() - this.start} millis`);
});

userSchema.plugin(uniqueValidator,{ message: "UserId 已經使用過" });

module.exports = mongoose.model("User", userSchema);
