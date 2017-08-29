var express = require("express");
var router = express.Router();
var helper = require("../helper");

router.get("/users", function(req,res) {
  res.render("mobile/users/index");
});

module.exports = router;
