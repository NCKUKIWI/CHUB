var express = require("express");
var engine = require("ejs-locals");             //讓express支援layout
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");
var User = require("./model/User");

var app = express();

app.engine("ejs", engine);
app.set("views",path.join(__dirname,"view"));  //view的路徑位在資料夾view中
app.set("view engine","ejs");                   //使用ejs作為template

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
    User.findOne({ _id:req.cookies.id},function(err,user){
      req.user = user;
      next();
    });
  }
  else {
    next();
  }
});

app.get("/",function(req,res){
  res.render("index");
});

//comments routes
var comments = require("./controller/comments");
app.use("/comment",comments);

//users routes
var users = require("./controller/users");
app.use("/user",users);



//projects routes
var projects = require("./controller/projects");
app.use("/project",projects);

//activities routes
var activities = require("./controller/activities");
app.use("/activty",activities);
//insert

app.listen( process.env.PORT || 3000);
console.log("running on port 3000");
