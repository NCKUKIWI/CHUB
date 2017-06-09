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

var paymentSchema = new Schema({
  Amt:Number,
  TradeNo:String,
  MerchantOrderNo:String,
  PayTime:String,
  PaymentType:String,
  EscrowBank:String,
  CreateAt: { type: Date, default: Date.now }
});

paymentSchema.pre("find", function(next) {
  this.start = Date.now();
  next();
});

paymentSchema.post("find", function(result) {
  //console.log(JSON.stringify(result,null,4));
  console.log(`Modal payment took ${ Date.now() - this.start} millis`);
});

paymentSchema.plugin(uniqueValidator);
var Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
