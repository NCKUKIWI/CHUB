var mongoose = require("mongoose");
var config = require("../config");
mongoose.connect(config.dburl);

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
{type: Date, default: Date.now, min: 18, max: 65, unique: true, required: true}
*/

var commentSchema = new Schema({
  ProjectID:Number,
  ActivityID:Number,
  Context:String,
  IsRead:Boolean,
  PeopleID:Number,
  ResCommentID:Number,
  CreateAt: { type: Date, default: Date.now }
});

/*
commentSchema.methods.customMethod = function() {
  return this.model("Comment").find();
};
*/

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
