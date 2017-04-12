var config = require("./config");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email.sender,
      pass: config.email.pw
    }
});

exports.handleError = function handleError(err) {
	var errmsg = [];
	for(var i in err.errors) {
		errmsg.push(err.errors[i].message);
	}
	return errmsg;
}

exports.removeFromArray = function removeFromArray(arr,element) {
	var index = arr.indexOf(element);
  if(index!=-1){
    arr.splice(index,1);
  }
  return arr;
}

exports.sendEmail = function sendEmail(toEmail,subject,text){
	var options = {
	  from: config.email.sender,
	  to:toEmail,
	  subject:subject,
	  text:text
	};
	transporter.sendMail(options, function(error, info){
	    if(error){
	      console.log(error);
	    }else{
	      console.log('訊息發送: ' + info.response);
	    }
	});
}

exports.checkLogin = function checkLogin(){
  return function(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.send("notLogin");
    }
  }
}
