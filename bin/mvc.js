#! /usr/bin/env node

var fs = require("fs");
var chalk = require("chalk");
var template = require("./template");
__dirname += "/..";
var argv = require("yargs").help("h")
	.usage("\nUsage: mvc <command> [option]")
	.example("mvc g -c user", "Generate controller named user.js")
	.example("mvc g -c user index","Generate controller named user.js with index.ejs")
	.example("mvc d -c user", "Destroy controller named user.js")
	.command(["generate", "g"], "Generate model or controller", {
			controller: {
				alias: "c",
				type: "array"
			},
			model: {
				alias: "m"
			}
		},
		function(argv) {
			if(argv.c.length > 0) {
				fs.mkdir(__dirname + "/controller", function(e) {
					if(!e || (e && e.code === 'EEXIST')) {
						fs.writeFile(__dirname + `/controller/${argv.c[0]}.js`, template.controller(argv.c[0], argv.c), function(err) {
							if(err) {
								return console.log(err);
							}
							console.log(chalk.green(`Controller ${argv.c[0]}.js create!`));
							if(argv.c.length > 1) {
								fs.mkdir(__dirname + `/view`, function(e) {
									if(!e || (e && e.code === 'EEXIST')) {
										var folder = argv.c[0];
										fs.mkdir(__dirname + `/view/${folder}`, function(e) {
											if(!e || (e && e.code === 'EEXIST')) {
												argv.c.forEach(function(element, index) {
													if(index != 0) {
														fs.writeFile(__dirname + `/view/${folder}/${element}.ejs`, template.view(), function(err) {
															if(err) {
																return console.log(err);
															}
															console.log(chalk.green(`View ${element}.ejs create!`));
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
			} else if(argv.m) {
				fs.mkdir(__dirname + "/model", function(e) {
					if(!e || (e && e.code === 'EEXIST')) {
						fs.writeFile(__dirname + "/model/" + argv.m + ".js", "", function(err) {
							if(err) {
								return console.log(err);
							}
							console.log(chalk.green(`Model ${argv.m}.js create!`));
						});
					} else {
						console.log(e);
					}
				});
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
			if(argv.c) {
				fs.unlink(__dirname + `/controller/${argv.c}.js`, function(err) {
					if(err) {
						return console.log(chalk.red(err.code));
					}
					console.log(chalk.red(`Controller ${argv.c}.js delete`));
					if(fs.existsSync(__dirname + `/view/${argv.c}`)) {
						fs.readdir(__dirname + `/view/${argv.c}`, function(err, files) {
							if(err) {
								return console.log(err);
							}
							files.forEach(function(file) {
								fs.unlink(__dirname + `/view/${argv.c}/${file}`, function(err) {
									if(err) {
										return console.log(chalk.red(err.code));
									}
								});
							});
							fs.rmdir(__dirname + `/view/${argv.c}`, function(err) {
								if(err) {
									return console.log(chalk.red(err.code));
								}
								console.log(chalk.red(`View folder ${argv.c} delete`));
							});
						});
					}
				});
			} else if(argv.m) {
				fs.unlink(__dirname + `/model/${argv.m}.js`, function(err) {
					if(err) {
						return console.log(chalk.red(err.code));
					}
					console.log(chalk.red(`Controller ${argv.m}.js delete`));
				});
			}
		}
	)
	.describe("c", "Controller name")
	.describe("m", "Model name")
	.describe("v", "View name")
	.locale("en")
	.argv;
