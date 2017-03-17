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

var messageSchema = new Schema({
  FromID:Number,
  ToID:Number,
  Time:Date,
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

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;
