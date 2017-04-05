var User = require("./model/User");
var Project = require("./model/Project");
var helper = require("./helper");
User.find({$or:[{}]},function(err,user){
  console.log(user);
});
