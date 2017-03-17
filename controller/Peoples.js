var express = require("express");
var router = express.Router();
var People = require('../model/People');


router.get("/", function(req,res) {
  res.render("Peoples/index");
});

router.get("/test", function(req,res) {
  res.render("Peoples/test");
});

router.get("/:id", function(req,res) {
  res.render("Peoples/show");
});



module.exports = router;
