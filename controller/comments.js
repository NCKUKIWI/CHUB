var express = require("express");
var router = express.Router();
var Comment = require('../model/Comment');

router.get("/", function(req,res) {
  res.render("comments/index");
});

module.exports = router;
