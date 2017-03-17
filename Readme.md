# C-HUB

## Setup

```sh
npm install
```

```sh
npm link
```

## MVC Generator

```sh
Usage: mvc <command> [option]

Commands:
  generate  Generate model or controller                            [aliases: g]
  destroy   Destroy model or controller                             [aliases: d]
  list      Show MVC folder                                        [aliases: ls]
  destroy   Destroy model or controller                             [aliases: d]
  new       Generate app.js file

Options:
  -h  Show help                                                        [boolean]
  -c  Controller name
  -m  Model name
  -v  View name
  -s  Schema setting

Examples:
  mvc g -c user                            Generate controller named user.js
  mvc g -c user index                      Generate controller named user.js with index.ejs
  mvc d -c user                            Destroy controller named user.js
  mvc g -m user                            Generate model named User.js
  mvc g -m user -s name:String age:Number  Generate model named User.js with schema setting
  mvc d -m user                            Destroy model named User.js
```
