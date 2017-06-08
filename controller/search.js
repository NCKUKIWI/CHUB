var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Group = require("../model/Group");
var Project = require("../model/Project");
var Message = require("../model/Message");
var Activity = require("../model/Activity");
// var config = require("../config");
// var helper = require("../helper");
// var bcrypt = require('bcrypt');
// var graph = require("fbgraph");
// var cacheClear = require("../cache").clear;
// var fs = require("fs");
// var rimraf = require("rimraf");
// var multer  = require('multer');

router.get('/', function(req,res){
  console.log(req.query);
  var queryColumn = {
    Skill: 1,
    Major: 1
  }
  var results = {}; // 放query出來的值
  var filter = []; // 加條件去query用的

  // user條件
  filter.push({Name: (new RegExp(req.query.query, "i"))});
  // filter.push({Skill: req.query.query});
  // filter.push({Major: req.query.query});
  
  User.find({$or:filter}, function(err, query){
    if(query.length != 0){
      results.people = {
        name: 'people',
        results: []
      };
      for(var i in query){
        var obj = {
          'title': query[i].Name,
          'url': '/users?id=' + query[i]._id
        }
        results.people.results.push(obj);
      }
    }
    // filter.length = 1; // 清空user的特別條件
    Group.find({$or:filter}, function(err, query){
      if(query.length != 0){
        results.group = {
          name: 'group',
          results: []
        };
        for(var i in query){
          var obj = {
            'title': query[i].Name,
            'url': '/groups?id=' + query[i]._id,
            'description': query[i].Skill
          }
          results.group.results.push(obj);
        }
      }
      Activity.find({$or:filter}, function(err, query){
        if(query.length != 0){
          results.activity = {
            name: 'activity',
            results: []
          };
          for(var i in query){
            var obj = {
              'title': query[i].Name,
              'url': '/activities?id=' + query[i]._id
            }
            results.activity.results.push(obj);
          }       
        }
        Project.find({$or:filter}, function(err, query){
          if(query.length != 0){
            results.project = {
              name: 'project',
              results: []
            };
            for(var i in query){
              var obj = {
                'title': query[i].Name,
                'url': '/project?id=' + query[i]._id
              }
              results.project.results.push(obj);
            }
          }
          res.send(results);
        })
      })
    })
  })
});

module.exports = router;