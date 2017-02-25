var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String
});

var User = mongoose.model('User', userSchema);

exports.register = function(username, password){
	var user = new User({username: username, password: password});
	user.save(function(err, result){
		if(err){
			console.log(err);
		}else{
			console.log(result);
		}
	});
}

exports.login = function(username, password){
	var query = User.findOne({username: username, password: password}, function(err, result){
		if(err) throw err;
	});
	return query;
	console.log(query);
}
