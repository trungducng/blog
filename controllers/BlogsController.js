var blog = require('../models/blog');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
app.use(cookieParser()); 
app.use(session({secret: "Shh, its a secret!"}));

exports.listBlog = function(req, res){
	// if(req.session.user || req.cookies.user){
		var query = blog.listBlog();
		query.exec(function(err,blogg){
	   	if(err) throw console.log(err);
			res.render('listBlog', {blogs: blogg});		
		});
	// }else{
	// 	res.redirect('/login');
	// }
}

exports.addBlog = function(req, res){
	// if(req.session.user || req.cookies.user){
		if(req.body.title != 'undefined' && req.body.content != 'undefined' && req.body.author != 'undefined'){
			var title =  req.body.title;
			var content = req.body.content;
			var author = req.body.author;
			var type = req.body.type;
			var created = Date.now();
			blog.addBlog(title, content, author, type, created);
			res.redirect('/');
		}
	// }else{
	// 	res.redirect('/login');
	// }
}

exports.searchBlog = function(req, res){
	// if(req.session.user || req.cookies.user){
		var title = req.body.title;
		var query = blog.searchBlog(title);
		query.exec(function(err,blogg){
	    if(err) throw console.log(err);
		   	res.render('searchBlog',{blogs:blogg});
		});
	// }else{
	// 	res.redirect('/login');
	// }	
}

exports.editBlog = function(req, res){
	// if(req.session.user || req.cookies.user){
		if(req.body.submit){
			var id = req.body.id;
			var title = req.body.title;
			var content = req.body.content;
			var author = req.body.author;
			var type = req.body.type;
			var created = Date.now();

			blog.editBlog(id, title, content, author, type, created);
			res.redirect('/api');
		}
	// }else{
	// 	res.redirect('/login');
	// }
}

exports.deleteBlog = function(req, res){
	// if(req.session.user || req.cookies.user){
		var id = req.params.id;
		// console.log(id);
		blog.deleteBlog(id);
		res.redirect('/api');
	// }else{
	// 	res.redirect('/login');
	// }	
}

exports.viewBlog = function(req, res){
	// if(req.session.user || req.cookies.user){
		var id = req.params.id;
		var query = blog.viewBlog(id);
		query.exec(function(err, blogg){
			if(err) throw console.log(err);
			res.render('viewBlog', {blogs: blogg});
		});
	// }else{
	// 	res.redirect('/login');
	// }	
}