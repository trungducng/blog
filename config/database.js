
exports.connectDatabase = function(req, res){

	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost:27017/blog', function(err){
		if(err){
			console.log(err);
		}else{
			console.log('Connect successfully!');
		}
	});


}