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
  UserID:{ type:String,required:[true,"請輸入用戶名稱"] ,unique:true },
  Email:String,
  Password:{ type: String, minlength:[8,"密碼需大於8碼"],required:[true,"請輸入密碼"] },
  Name:{ type: String,required: [true,"請輸入用戶姓名"] },
  Major:String,
  Talent:[String],
  Description:{ type: String, minlength:0, maxlength:100 },
  Website:String,
  Role:Number,
  CreateAt: { type: Date, default: Date.now }
});

/*
userSchema.methods.customMethod = function() {
  return this.model("User").find();
};
*/

userSchema.plugin(uniqueValidator,{ message: "UserId 已經使用過" });
var User = mongoose.model("User", userSchema);

module.exports = User;
