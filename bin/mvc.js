#! /usr/bin/env node

var fs = require("fs");
var chalk = require("chalk");
var argv = require('yargs').help('h').alias('g', 'generate').alias('d', 'destroy').alias('m', 'model').alias('c', 'controller').array("c").argv;
var template = require("./template");
__dirname+="/..";

if(argv.g) {
	if(argv.c.length > 0) {
		fs.mkdir(__dirname + "/controller", function(e) {
			if(!e || (e && e.code === 'EEXIST')) {
				fs.writeFile(__dirname + `/controller/${argv.c[0]}.js`,template.controller(argv.c[0],argv.c), function(err) {
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
												fs.writeFile(__dirname + `/view/${folder}/${element}.ejs`,template.view(), function(err) {
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
				fs.writeFile(__dirname + "/model/" + argv.m + ".js","", function(err) {
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
} else if(argv.d) {
	if(argv.c.length > 0) {
		fs.unlink(__dirname + `/controller/${argv.c[0]}.js`, function(err) {
			if(err) {
				return console.log(chalk.red(err.code));
			}
			console.log(chalk.red(`Controller ${argv.c}.js delete`));
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
