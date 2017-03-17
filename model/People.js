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
{type: Date, default: Date.now, min: 18, max: 65, unique: true, required: true,ref: 'Reference model'}
*/

var peopleSchema = new Schema({
  UserID:String,
  Password:String,
  Name:String,
  Majog:String,
  Talent:[String],
  Description:{ type: String, min:0, max:100 },
  Website:String,
  Role:Number,
  CreateAt: { type: Date, default: Date.now }
});

/*
peopleSchema.methods.customMethod = function() {
  return this.model("People").find();
};
*/

var People = mongoose.model("People", peopleSchema);

module.exports = People;
