var user = require('../models/user');
var session = require('express-session');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


exports.register = function(req, res){
	if(req.body.register){
		var username = req.body.username;
		var password = req.body.password;
		var re_password = req.body.re_password;

		if(username && password && re_password){
			if(password === re_password){
			user.register(username, password);
			res.redirect('/login');
			}else{
			console.log('passwords don\'t match');
			res.redirect('/register');
			}	
		}else{
			console.log('Username or password or re_password NOT FOUND');
			res.redirect('/register');
		}
	}
}


exports.logout = function(req, res){
	req.session.destroy();
	res.clearCookie('user');
	res.redirect('/login');
}