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
{type: Date, default: Date.now, min: 18, max: 65, unique: true, required: true}
*/

var activitySchema = new Schema({
  Type:String,
  Description:String,
  Time:[Date],
  AdminID:[Schema.Types.ObjectId],
  Context:String,
  GroupID:[Schema.Types.ObjectId],
  CreateAt: { type: Date, default: Date.now }
});

/*
activitySchema.methods.customMethod = function() {
  return this.model("Activity").find();
};
*/

var Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
