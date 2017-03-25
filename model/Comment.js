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

var commentSchema = new Schema({
  ProjectID:{type:ObjectId,ref:"Project"},
  ActivityID:{type:ObjectId,ref:"Activity"},
  Context:String,
  IsRead:Boolean,
  PeopleID:{type:ObjectId,ref:"User"},
  ResCommentID:ObjectId,
  CreateAt: { type: Date, default: Date.now }
});

/*
commentSchema.methods.customMethod = function() {
  return this.model("Comment").find();
};
*/
commentSchema.plugin(uniqueValidator);
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
