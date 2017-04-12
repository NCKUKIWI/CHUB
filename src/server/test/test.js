var should = require("should");
var request = require("request");
var User = require("../model/User");
var Project = require("../model/Project");
var headers = {
	"Cookie": "isLogin=1;"
}
describe('Api test', function(){
	after(function() {
		User.remove({"UserID":"Derek"},function(err) {
			if(err) console.log(err);
		});
	});
	describe("User", function() {
		it("Signup, pw length < 6 ", function(done) {
			request({
					url: "http://localhost:3000/user/signup",
					method: "POST",
					form: {
						"userid": "Derek",
						"pw": "123456",
						"name": "Derek Chen"
					}
				},
				function(error, response, body) {
					body.should.not.equal("ok");
					done();
				});
		})
		it("Signup", function(done) {
			request({
					url: "http://localhost:3000/user/signup",
					method: "POST",
					form: {
						"userid": "Derek",
						"pw": "12345678",
						"name": "Derek Chen"
					}
				},
				function(error, response, body) {
					body.should.be.equal("ok");
					done();
				});
		})
		it("Signup duplicate", function(done) {
			request({
					url: "http://localhost:3000/user/signup",
					method: "POST",
					form: {
						"userid": "Derek",
						"pw": "12345678",
						"name": "Derek Chen"
					}
				},
				function(error, response, body) {
					body.should.not.equal("ok");
					done();
				});
		})
		it("Login", function(done) {
			request({
					url: "http://localhost:3000/user/auth",
					method: "POST",
					form: {
						"userid": "Derek",
						"pw": "12345678",
						"name": "Derek Chen"
					}
				},
				function(error, response, body) {
					body.should.be.equal("ok");
					headers["Cookie"]+=response.headers["set-cookie"][1];
					done();
				});
		});
	});
	describe("Project", function() {
		it("Create a project", function(done) {
			request({
				url: "http://localhost:3000/project/create",
				method: "POST",
				headers:headers,
				form: {
					"name":"testproject",
					"type":"test",
					"time":"2016/11/22,2016/11/23",
					"goal":"goal",
					"need":"a,b,c,d",
					"description":"description"
				}
			},function(error, response, body) {
				body.should.be.equal("ok");
				done();
			});
		});
		it("Apply for a project", function(done) {
			Project.findOne({Name:"testproject"},function(err,project){
				request({
					url: "http://localhost:3000/project/join",
					method: "POST",
					headers:headers,
					form: {
						"project_id":project._id.toString()
					}
				},function(error, response, body) {
					body.should.be.equal("ok");
					done();
				});
			});
		});
	});
})
