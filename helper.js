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
	  from: `"CHUB" ${config.email.sender}`,
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

exports.apiAuth = function apiAuth(){
  return function(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.send({error:"notLogin"});
    }
  }
}

exports.noinjection = function noinjection(req){
  for(var i in req.body){
    if(typeof(req.body[i] == 'object')){ // 避免有array的情形
      for(var j in req.body[i]){
        req.body[i][j] = req.body[i][j].replace(/\'|\#|\/|\*|\{|\}|\:/g,"");
      }
    }
    else {
      req.body[i] = req.body[i].replace(/\'|\#|\/|\*|\{|\}|\:/g,""); 
    }
    
  }
  for(var i in req.query){
    if(typeof(req.query[i] == 'object')){ // 避免有array的情形
      for(var j in req.query[i]){
        req.query[i][j] = req.query[i][j].replace(/\'|\#|\/|\*|\{|\}|\:/g,"");
      }
    }
    else {
      req.query[i] = req.query[i].replace(/\'|\#|\/|\*|\{|\}|\:/g,""); 
    }
  }
}

exports.checkLogin = function checkLogin(v){
  if(v === undefined){
    return function(req, res, next) {
      if(req.user) {
        next();
      } else {
        res.redirect("back");
      }
    }
  }else{
    return function(req, res, next) {
      if(!req.user) {
        next();
      } else {
        res.redirect("back");
      }
    }
  }
}
