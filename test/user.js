var should = require('should');
var request = require('request');

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
				body.should.be.exactly("Fail");
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
				body.should.be.exactly("Success");
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
				body.should.be.exactly("Success");
				done();
			});
	})
})
