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

var groupSchema = new Schema({
  Name:String,
  Type:String,
  AdminID:[Number],
  Website:String,
  Description:String,
  CreateAt: { type: Date, default: Date.now }
});

/*
groupSchema.methods.customMethod = function() {
  return this.model("Group").find();
};
*/

var Group = mongoose.model("Group", groupSchema);

module.exports = Group;
