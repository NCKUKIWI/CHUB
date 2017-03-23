var mongoose = require("./mongoose");
var uniqueValidator = require('mongoose-unique-validator');
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
  FromID:ObjectId,
  ToID:ObjectId,
  Context:String,
  IsRead:Boolean,
  FromIDType:String,
  ToIDType:String,
  CreateAt: { type: Date, default: Date.now }
});

/*
messageSchema.methods.customMethod = function() {
  return this.model("Message").find();
};
*/
messageSchema.plugin(uniqueValidator);
var Message = mongoose.model("Message", messageSchema);

module.exports = Message;
