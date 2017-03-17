var mongoose = require("./mongoose");

var Schema = mongoose.Schema;

/*
Schema Type
------------
What? => In mongoose
Words => String
True/False => Boolean
Integer => Number
Array => []
Array of String => [String]
{type: Date, default: Date.now, minlength: 18, maxlength: 65, unique: true, required: true,ref: 'Reference model'}
*/

var userSchema = new Schema({
  UserID:{ type:String,required:[true,"請輸入用戶名稱"] ,unique:true },
  Email:String,
  Password:{ type: String, minlength:[8,"密碼需大於8碼"],required: true },
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

var User = mongoose.model("User", userSchema);

module.exports = User;
