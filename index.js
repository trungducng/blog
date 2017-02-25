//import essential modules
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config/config');
//
var apiRoutes = express.Router();

//connect to database:
var database = require('./config/database');
database.connectDatabase();
//


//middleware area
app.use(upload.array()); // for parsing multipart/form-data (for multer.upload) 
app.use(bodyParser.urlencoded({extended: true}));  // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for cookie
app.use(session({secret: "abc"})); // for session
app.use(express.static('public')); // Serving static files
app.use(morgan('dev')); //log


//load view
app.set('view engine', 'pug');
app.set('views', './views');
//

//load BlogController:
var BlogsController = require('./controllers/BlogsController');
var UsersController = require('./controllers/UsersController');

//load add-blog-form:
var blog = require('./models/blog');
var user = require('./models/user');


//register for user
apiRoutes.get('/register', function(req, res){
  res.render('register');
});

apiRoutes.post('/register', UsersController.register);


apiRoutes.get('/login', function(req, res){
  res.render('login');
});

apiRoutes.post('/login', function(req, res){
    if(req.body.login){
    var username = req.body.username;
    var password = req.body.password;
    var remember_me = req.body.remember_me;
    if(username && password){
      var query = user.login(username, password); 
      query.exec(function(err, result){
        if(err) throw console.log(err);
        console.log(result);
        if(result!=null){
          var token = jwt.sign(result, config.secret, {expiresIn: 60*60*24}); //create token
          req.session.token = token;
          console.log(token);
          req.session.user = username; // create session    

          if(remember_me){
            res.cookie('user', username, {maxAge: 10800}); //create cookie
            res.cookie('token', token, {maxAge: 10800});
          }
          res.redirect('/api');
        }else{
          res.redirect('/login');
        }
      });
    }else{
      res.redirect('/login');
    }
  }
});




apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.session.token || req.cookies.token;
  console.log(req.session.token);

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // // if there is no token
    // // redirect to login page
    // return res.status(403).send({ 
    //     success: false, 
    //     message: 'No token provided.' 
    // });
    res.redirect('/api/login');
    
  }
});




//show blog list
apiRoutes.get('/', BlogsController.listBlog);

apiRoutes.get('/viewblog/:id', BlogsController.viewBlog);

//add a new blog
apiRoutes.get('/addblog', function(req,res){
    if(req.session.user){
    res.render('addBlog');
  }else{
    res.redirect('/api/login');
  }
});
apiRoutes.post('/addblog', BlogsController.addBlog);

//


//search Blog
apiRoutes.get('/searchblog', function(req,res){
  if(req.session.user){
    res.render('searchBlog');
  }else{
    res.redirect('/login');
  }
});
apiRoutes.post('/searchblog', BlogsController.searchBlog);
//


//edit Blog
apiRoutes.get('/editblog/:id', function(req,res){
  res.render('editblog', {id: req.params.id});
});
apiRoutes.post('/editblog', BlogsController.editBlog);
//

//deleteblog
apiRoutes.get('/deleteblog/:id', BlogsController.deleteBlog)




apiRoutes.get('/logout', UsersController.logout);




app.use('/api', apiRoutes);

app.listen(80, function (){
  console.log('Server is now running in port 80');
});