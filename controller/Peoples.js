var express = require("express");
var router = express.Router();
var People = require('../model/People');


router.get("/", function(req,res) {
  res.render("peoples/index");
});

router.get("/test", function(req,res) {
  res.render("peoples/test");
});

router.get("/:id", function(req,res) {
  res.render("peoples/show");
});


module.exports = router;