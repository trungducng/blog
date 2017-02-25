var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
var blogSchema = new Schema({
  title: String,
  content: String,
  author: String,
  type: String,
  created: Date
});

var Blog = mongoose.model('Blog', blogSchema);

exports.addBlog = function(title, content, author, type, created){
	var blog = new Blog({title: title, content: content, author: author, type: type, created: created});
	blog.save(function(err, data){
		if(err){
			console.log(err);
		}else{
			console.log('Add blog successfully!' + data);
		}
	});
}

exports.listBlog = function(){
	var query = Blog.find({});
	return query;
}

exports.searchBlog = function(title){
	var query = Blog.findOne({title: title}, function(err, blogTitle){
		if(err) throw console.log(err);
	});
	return query;
}

exports.editBlog = function(id, title, content, author, type, created){
	Blog.findByIdAndUpdate(id, {title: title, content: content, author: author, type: type, created: created}, function(err, blogTitle){
		if(err) throw err;
		console.log(blogTitle);
	});
}

exports.deleteBlog = function(id){
	var query  = Blog.findByIdAndRemove(id, function(err, result){
		if(err) throw err;
	});
}


exports.viewBlog = function(id){
	var query = Blog.findById(id, function(err, result){
		if(err) throw console.log(err);
	});

	return query;
		
}
