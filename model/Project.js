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

var projectSchema = new Schema({
  Type:String,
  Time:[Date],
  Goal:String,
  Need:[String],
  Sponser:[String],
  Description:String,
  AdminID:[Schema.Types.ObjectId],
  GroupID:Schema.Types.ObjectId,
  CreateAt: { type: Date, default: Date.now }
});

/*
projectSchema.methods.customMethod = function() {
  return this.model("Project").find();
};
*/

var Project = mongoose.model("Project", projectSchema);

module.exports = Project;
