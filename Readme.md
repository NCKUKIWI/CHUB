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
