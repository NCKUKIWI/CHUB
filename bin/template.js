var controller = function(name, views) {
	var cname = name.charAt(0).toUpperCase() + name.slice(1, -1);
	var hasShow = false;
	var route = "";
	if(views.length > 0) {
		views.forEach(function(view, index) {
			var list = [];
			if(index != 0) {
				if(view == "index") {
					list.push("", "index");
				} else if(view == "show") {
					hasShow = true;
				} else {
					list.push(view, view);
				}
				if(list[1]) {
					route += `
router.get("/${list[0]}", function(req,res) {
  res.render("${name}/${list[1]}");
});
`;
				}
			}
		});
		if(hasShow) {
			route += `
router.get("/:id", function(req,res) {
  res.render("${name}/show");
});
`;
		}
	}
	return `var express = require("express");
var router = express.Router();
var ${cname} = require("../model/${cname}");

${route}

module.exports = router;`;
}

var view = function(folder, view) {
	return `<% layout('../public/layout') %>
Find me in view/${folder}/${view}.ejs`;
}

var model = function(name, schemalist) {
	var cname = name.charAt(0).toUpperCase() + name.slice(1);
	var schema = "";
	if(schemalist) {
		for(var i in schemalist) {
			var slice = schemalist[i].split(":");
			slice[1] = slice[1].charAt(0).toUpperCase() + slice[1].slice(1);
			schema += `  ${slice[0]}:${slice[1]},\n`;
		}
		schema += `  CreateAt: { type: Date, default: Date.now }`
	}
	return `var mongoose = require("./mongoose");
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
Mongo obj id => ObjectId

Mutiple option
{type: Date , default: Date.now }
{type: String , unique: true, required: true }
{type: String , minlength: 18, maxlength: 65 }
{type: String , ref:"Reference collection name" }
*/

var ${name}Schema = new Schema({
${schema}
});

/*

Custom method
${name}Schema.methods.customMethod = function() {
  return this.model("${cname}").find();
};

Custom err message
${name}Schema.plugin(uniqueValidator,{ message: "Cutstom message" });

*/

${name}Schema.plugin(uniqueValidator);
var ${cname} = mongoose.model("${cname}", ${name}Schema);

module.exports = ${cname};`;
}

var app = function() {
	return `var express = require("express");
var engine = require("ejs-locals");             //讓express支援layout
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");

var app = express();

app.engine("ejs", engine);
app.set("views",path.join(__dirname,"view"));  //view的路徑位在資料夾view中
app.set("view engine","ejs");                   //使用ejs作為template

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Validator
app.use(expressValidator());

app.use("/assets",express.static(__dirname + "/assets"));

//Handle sessions and cookie
app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  secret:"secret",
  resave: true,
  saveUninitialized: true,
}));

app.use(cookieParser("secretString"));

//insert

app.listen( process.env.PORT || 3000);
console.log("running on port 3000");
`;
}

var json = function(name) {
	return `{
	"name": "${name}",
	"version": "1.0.0",
	"description": "none",
	"main": "app.js",
	"scripts": {
	   "test": "mocha --timeout=10000",
	   "start": "node ./node_modules/nodemon/bin/nodemon app.js"
	},
	"bin": {
	  "mvc": "./bin/mvc.js"
	},
	"author": "author",
	"license": "ISC",
	"dependencies": {
	  "body-parser": "^1.15.2",
	  "cookie-parser": "^1.4.3",
	  "ejs": "^2.4.2",
	  "ejs-locals": "^1.0.2",
	  "express": "^4.14.0",
	  "express-session": "^1.14.0",
   	"express-validator": "^2.20.8",
	  "mongoose": "^4.9.0",
		"mongoose-unique-validator": "^1.0.5",
	  "nodemon": "^1.9.2",
	  "yargs": "^7.0.2"
	},
	"devDependencies": {
	  "mocha": "^3.2.0",
	  "request": "^2.81.0",
	  "should": "^11.2.1"
	}
}`;
}

var mongoose = function() {
	return `var mongoose = require("mongoose");
var config = require("../config");
mongoose.connect(config.dburl);
module.exports = mongoose;`;
}

var config = function() {
	return `exports.dburl="dburl"
exports.dbuser="root";
exports.dbpw="1234567890";`;
}

exports.model = model;
exports.view = view;
exports.controller = controller;
exports.app = app;
exports.json = json;
exports.mongoose = mongoose;
exports.config = config;
