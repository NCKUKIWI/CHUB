# C-HUB

## Setup

```sh
npm install
```

## Test

```sh
npm test
```

## MVC Generator

```sh
Usage: mvc <command> [option]

Commands:
  generate  Generate model or controller                            [aliases: g]
  destroy   Destroy model or controller                             [aliases: d]
  list      Show MVC folder                                        [aliases: ls]
  new       Generate a new project!

Options:
  -h  Show help                                                        [boolean]
  -c  Controller name
  -m  Model name
  -s  Schema setting

Examples:
  mvc g -c user                            Generate controller named user.js
  mvc g -c user index                      Generate controller named user.js with index.ejs
  mvc d -c user                            Destroy controller named user.js
  mvc g -m user                            Generate model named User.js
  mvc g -m user -s name:String age:Number  Generate model named User.js with schema setting
  mvc d -m user                            Destroy model named User.js
  mvc new -n newproject                    Generate a new project name newproject                     
```       

## Mongo realation

```js
var userSchema = new Schema({
  Email:String,
  Name:String
});

var commentSchema = new Schema({
  Context:String,
  PeopleID:{type:ObjectId,ref:'User'},
});
//Message ToID 欄位 與 User _id 關聯
Comment.findOne({PeopleID:"objid"}).populate('PeopleID').exec(function(err,comment){
  console.log(comment);
  //會透過 PeopleID 去 Join User collection 中 _id 與 PeopleID 一致的資料進來
});
```

## Async

(1)Promise

```js
var result = [];
Project.find({}).exec().then(function(projects){
	result.push(projects)
	return User.find({}).exec()
}).then(function(users){
	result.push(users)
	return Message.find({}).exec()
}).then(function(msgs){
	result.push(msgs)
	res.send(result)
})
```

(2)Async / Await

需要nodejs v7.6或 babel

```js
app.router("/",async function(req,res){
  var users = await User.find({}).exec();
  var projects = await Project.find({}).exec();
  res.send({
    users:users,
    projects:projects
  })
});
```
