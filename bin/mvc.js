#! /usr/bin/env node

var fs = require("fs");
var chalk = require("chalk");
var template = require("./template");
var path = process.cwd();
var argv = require("yargs").help("h")
	.usage("\nUsage: mvc <command> [option]")
	.example("mvc g -c user", "Generate controller named user.js")
	.example("mvc g -c user index", "Generate controller named user.js with index.ejs")
	.example("mvc d -c user", "Destroy controller named user.js")
	.example("mvc g -m user", "Generate model named User.js")
	.example("mvc g -m user -s name:String age:Number", "Generate model named User.js with schema setting")
	.example("mvc d -m user", "Destroy model named User.js")
	.example("mvc new -n newproject", "Generate a new project name newproject")
	.command(["generate", "g"], "Generate model or controller", {
			controller: {
				alias: "c",
				type: "array"
			},
			model: {
				alias: "m"
			},
			schema: {
				alias: "s",
				type: "array"
			}
		},
		function(argv) {
			if(fs.existsSync(path + `/app.js`)) {
				if(argv.c && argv.c.length > 0) {
					GenerateController(argv.c);
				} else if(argv.m) {
					GenerateModel(argv.m, argv.s);
				}
			} else {
				console.log(chalk.red("Not in project folder!"));
			}
		}
	)
	.command(["destroy", "d"], "Destroy model or controller", {
			controller: {
				alias: "c"
			},
			model: {
				alias: "m"
			}
		},
		function(argv) {
			if(fs.existsSync(path + `/app.js`)) {
				if(argv.c) {
					DestroyController(argv.c);
				} else if(argv.m) {
					DestroyModel(argv.m);
				}
			} else {
				console.log(chalk.red("Not in project folder!"));
			}
		}
	)
	.command(["list", "ls"], "Show MVC folder", {},
		function(argv) {
			if(fs.existsSync(path + `/model`)) {
				fs.readdir(path + `/model`, function(err, files) {
					if(err) {
						return console.log(err);
					}
					console.log("\nModel");
					files.forEach(function(file) {
						console.log(`|--- ${file}`);
					});
				});
			}
			if(fs.existsSync(path + `/view`)) {
				fs.readdir(path + `/view`, function(err, files) {
					if(err) {
						return console.log(err);
					}
					console.log("\nView");
					files.forEach(function(file) {
						console.log(`|--- ${file}`);
					});
				});
			}
			if(fs.existsSync(path + `/controller`)) {
				fs.readdir(path + `/controller`, function(err, files) {
					if(err) {
						return console.log(err);
					}
					console.log("\nController");
					files.forEach(function(file) {
						console.log(`|--- ${file}`);
					});
				});
			}
		}
	)
	.command("new", "Generate a new project!", {
			name: {
				alias: "n"
			}
		},
		function(argv) {
			if(argv.n){
				fs.mkdir(path + `/${argv.n}`, function(e) {
					if(e && e.code === 'EEXIST'){
						console.log(chalk.red(`Folder ${argv.n} already exist!`));
					}
					else{
						fs.writeFile(path + `/${argv.n}/app.js`, template.app(), function(err) {
							if(err) return console.log(err);
						});
						fs.writeFile(path + `/${argv.n}/package.json`, template.json(argv.n), function(err) {
							if(err) return console.log(err);
						});
						fs.writeFile(path + `/${argv.n}/config.js`, template.config(), function(err) {
							if(err) return console.log(err);
						});
						fs.mkdir(path + `/${argv.n}/controller`,function(e) {});
						fs.mkdir(path + `/${argv.n}/view`,function(e) {});
						fs.mkdir(path + `/${argv.n}/model`,function(e) {
							fs.writeFile(path + `/${argv.n}/model/mongoose.js`,template.mongoose(), function(err) {
								if(err) return console.log(err);
							});
						});
					}
				});
			}else{
				console.log(chalk.red("Please give project a name!"));
			}
		}
	)
	.describe("c", "Controller name")
	.describe("m", "Model name")
	.describe("s", "Schema setting")
	.describe("n", "Project setting")
	.locale("en")
	.argv;

function GenerateController(argvc) {
	fs.mkdir(path + "/controller", function(e) {
		if(!e || (e && e.code === 'EEXIST')) {
			fs.writeFile(path + `/controller/${argvc[0]}.js`, template.controller(argvc[0], argvc), function(err) {
				if(err) {
					return console.log(err);
				}
				console.log(chalk.green(`Controller ${argvc[0]}.js create!`));
				var appjs = fs.readFileSync('app.js').toString().split("\n");
				for(var i = appjs.length - 1; i >= 0; i--) {
					if(appjs[i] == "//insert") {
						var insertText = `
//${argvc[0]} routes
var ${argvc[0]} = require('./controller/${argvc[0]}');
app.use("/${argvc[0].slice(0, -1)}",${argvc[0]});`
						appjs.splice(i, 0, insertText);
						var text = appjs.join("\n");
						fs.writeFile('app.js', text, function(err) {
							if(err) return console.log(err);
						});
					}
				}
				if(argvc.length > 1) {
					fs.mkdir(path + `/view`, function(e) {
						if(!e || (e && e.code === 'EEXIST')) {
							var folder = argvc[0];
							fs.mkdir(path + `/view/${folder}`, function(e) {
								if(!e || (e && e.code === 'EEXIST')) {
									argvc.forEach(function(view, index) {
										if(index != 0) {
											fs.writeFile(path + `/view/${folder}/${view}.ejs`, template.view(folder, view), function(err) {
												if(err) {
													return console.log(err);
												}
												console.log(chalk.green(`View ${view}.ejs create!`));
											});
										}
									});
								} else {
									console.log(e);
								}
							});
						} else {
							console.log(e);
						}
					});
				}
			});
		} else {
			console.log(e);
		}
	});
}

function GenerateModel(argvm, argvs) {
	fs.mkdir(path + "/model", function(e) {
		if(!e || (e && e.code === 'EEXIST')) {
			var cargvm = argvm.charAt(0).toUpperCase() + argvm.slice(1);
			fs.writeFile(path + `/model/${cargvm}.js`, template.model(argvm, argvs), function(err) {
				if(err) {
					return console.log(err);
				}
				console.log(chalk.green(`Model ${cargvm}.js create!`));
			});
		} else {
			console.log(e);
		}
	});
}

function DestroyController(argvc) {
	fs.unlink(path + `/controller/${argvc}.js`, function(err) {
		if(err) {
			if(err.code == "ENOENT") {
				return console.log(chalk.red(`Controller ${argvc}.js not found`));
			}
			return console.log(chalk.red(err.code));
		}
		console.log(chalk.red(`Controller ${argvc}.js delete`));
		var appjs = fs.readFileSync('app.js').toString().split("\n");
		for(var i = appjs.length - 1; i >= 0; i--) {
			if(appjs[i] == `//${argvc} routes`) {
				appjs.splice(i, 1);
				appjs.splice(i, 1);
				appjs.splice(i, 1);
				var text = appjs.join("\n");
				fs.writeFile('app.js', text, function(err) {
					if(err) return console.log(err);
				});
				break;
			}
		}
		if(fs.existsSync(path + `/view/${argvc}`)) {
			fs.readdir(path + `/view/${argvc}`, function(err, files) {
				if(err) {
					return console.log(err);
				}
				files.forEach(function(file) {
					fs.unlink(path + `/view/${argvc}/${file}`, function(err) {
						if(err) {
							return console.log(chalk.red(err.code));
						}
					});
				});
				fs.rmdir(path + `/view/${argvc}`, function(err) {
					if(err) {
						return console.log(chalk.red(err.code));
					}
					console.log(chalk.red(`View folder ${argvc} delete`));
				});
			});
		}
	});
}

function DestroyModel(argvm) {
	var cargvm = argvm.charAt(0).toUpperCase() + argvm.slice(1);
	fs.unlink(path + `/model/${cargvm}.js`, function(err) {
		if(err) {
			if(err.code == "ENOENT") {
				return console.log(chalk.red(`Model ${cargvm}.js not found`));
			}
			return console.log(chalk.red(err.code));
		}
		console.log(chalk.red(`Model ${cargvm}.js delete`));
	});
}
