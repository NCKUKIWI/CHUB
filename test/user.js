var should = require('should');
var request = require('request');
var User = require('../model/User');

describe('User', function() {
	it('Signup, pw length < 6 ', function(done) {
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
	it('Signup', function(done) {
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
	it('Signup,duplicate and password < 6', function(done) {
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
	it('Login', function(done) {
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
				done();
			});
	})
	after(function() {
		console.log("Clean test data");
		User.findOneAndRemove({UserID:"Derek"},function(err) {
			if(err) throw err;
		});
	})
})
