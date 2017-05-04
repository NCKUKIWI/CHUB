var request = require("request");
var User = require("./model/User");
var Project = require("./model/Project");
var headers = {
	"Cookie": "isLogin=1;"
}

request({
		url: "http://localhost:3000/users/auth",
		method: "POST",
		form: {
			"userid": "cindy@gmail.com",
			"password": "12345678"
		}
	},
	function(error, response, body) {
		headers["Cookie"]+=response.headers["set-cookie"][1];
		request({
			url: "http://localhost:3000/activities/join",
			method: "POST",
			headers: headers,
			form: {
				activity_id:"590acc15536a130554db5c37"
			}
		}, function(error, response, body) {
			console.log(body);
		});
	});
