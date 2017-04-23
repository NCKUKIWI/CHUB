var request = require("request");
var User = require("./model/User");
var Project = require("./model/Project");
var headers = {
	"Cookie": "isLogin=1;"
}

request({
		url: "http://localhost:3000/user/auth",
		method: "POST",
		form: {
			"userid": "cindy@gmail.com",
			"password": "12345678"
		}
	},
	function(error, response, body) {
		headers["Cookie"]+=response.headers["set-cookie"][1];
		request({
			url: "http://localhost:3000/project/join",
			method: "POST",
			headers: headers,
			form: {
				"project_id":"58fcc54fa5fff73374a32f63"
			}
		}, function(error, response, body) {
			console.log(body);
		});
	});
