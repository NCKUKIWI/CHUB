var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");
var engine = require('ejs-locals');     //讓express支援layout
var User = require("./model/User");
var app = express();

app.engine('ejs', engine);
app.set('views',path.join(__dirname,'views'));  //view的路徑位在資料夾views中
app.set('view engine','ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/assets",express.static(__dirname + "/assets"));

//Handle sessions and cookie
app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  secret:"secret",
  resave: true,
  saveUninitialized: true,
}));

app.use(cookieParser("secretString"));
app.use(function(req, res, next) {
  if(req.cookies.isLogin){
    User.findOne({ _id:req.cookies.id},["_id","Name","Email","Major","Talent","Description","Website","Role"],function(err,user){
      req.user = user;
      next();
    });
  }
  else {
    next();
  }
});

//users routes
var users = require("./controller/users");
app.use("/users",users);

//projects routes
var projects = require("./controller/projects");
app.use("/projects",projects);

//activities routes
var activities = require("./controller/activities");
app.use("/activities",activities);

//groups routes
var groups = require("./controller/groups");
app.use("/groups",groups);

//messages routes
var messages = require("./controller/messages");
app.use("/messages",messages);
//insert

app.get("/about",function(req,res){
  res.render("about");
});

app.get("/space",function(req,res){
  res.render("space",{
    me:req.user
  });
});

app.get("/whaton",function(req,res){
  res.render("what_on",{
    me:req.user
  });
});

app.get("/*",function(req,res){
  res.render("index",{
    me:req.user
  });
});

app.listen( process.env.PORT || 3000);
console.log("running on port 3000");
