var express = require('express');
var engine = require('ejs-locals');             //讓express支援layout
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var people = require('./controller/Peoples');

var app = express();

app.engine('ejs', engine);
app.set('views',path.join(__dirname,'view'));  //view的路徑位在資料夾view中
app.set('view engine','ejs');                   //使用ejs作為template

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Validator
app.use(expressValidator());
app.use("/assets",express.static(__dirname + "/assets"));

//Handle sessions and cookie
app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  secret:'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(cookieParser('secretString'));
app.use("/people",people);

app.listen( process.env.PORT || 3000);                             //監聽3000port
console.log('running on port 3000');
