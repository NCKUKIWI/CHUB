var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");
var engine = require("ejs-locals");     //讓express支援layout
var helper = require("./helper");
var User = require("./model/User");
var logger = require("morgan");
var app = express();

app.engine("ejs", engine);
app.set("views",path.join(__dirname,"views"));  //view的路徑位在資料夾views中
app.set("view engine","ejs")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/assets",express.static("assets",{ maxAge: 30*60*1000 }));
app.use("/uploads",express.static("uploads"));

//Handle sessions and cookie
app.use(cookieParser("secretString"));
app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  secret:"secret",
  resave: true,
  saveUninitialized: true,
}));


var userInfo = ["_id", "Email", "EmailConfirm", "Name","School", "RecoveryEmail", "Major", "Skill", "Introduction", "Location", "Role", "Link", "GroupID", "ProjectID", "ActivityID","portfolio","Avatar"];

app.use(function(req, res, next) {
  helper.noinjection(req);
  res.locals.query = req.query;
  if(req.cookies.isLogin){
    User.findById(req.cookies.id,userInfo).populate("GroupID","_id Name").populate("ProjectID","_id Name").populate("ActivityID","_id Name").exec(function(err,user){
      req.user = user;
      res.locals.me = user;
      next();
    });
  }
  else {
    res.locals.me = false;
    next();
  }
});

app.use(logger("tiny"));

//mobile
var mobile = require("./controller/mobile");
app.use("/m",mobile);

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

//panel routes
var panel = require("./controller/panel");
app.use("/panel",helper.checkLogin(),panel);

//messages routes
var messages = require("./controller/messages");
app.use("/messages",messages);

//payment routes
var payment = require("./controller/payment");
app.use("/payment",payment);

//search routes
var search = require("./controller/search");
app.use("/search",search);


// app.get("/about",function(req,res){
//   res.render("about");
// });

//home routes (what's on)
var whatOn = require("./controller/whatOn");
app.use("/",whatOn);






//insert
app.get("/space",function(req,res){
  res.render("space");
});

app.get("/whaton",function(req,res){
  res.render("what_on");
});

// app.get("/*",function(req,res){
//   res.render("index");
// });

app.listen( process.env.PORT || 5000);
console.log("running on port 5000");
