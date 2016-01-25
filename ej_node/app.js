var GOOGLE_CONSUMER_KEY = '793656058167-hu7pegct1m19svc5cmoarb5ltn5bknfp.apps.googleusercontent.com';
var GOOGLE_CONSUMER_SECRET = 'WxpQSYS1lldy40HpzF3VKd7W';

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	mongoskin = require('mongoskin'),
	dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/mynode',
	db = mongoskin.db(dbUrl, {safe: true}),
	collections = {
		users: db.collection('users')
	},
	everyauth = require('everyauth');

var session = require('express-session'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

everyauth.debug = true;
everyauth.google
	.appId(GOOGLE_CONSUMER_KEY)
	.appSecret(GOOGLE_CONSUMER_SECRET)
	.handleAuthCallbackError( function (req, res) {
	})
	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
	.findOrCreateUser( function (session, accessToken, accessTokenSecret, googleUser) {
		console.log(googleUser);
		var promise = this.Promise();
	    process.nextTick(function(){
	    	session.user = googleUser;
	    	
	    	if (googleUser.email === 'ej8486.choi@gmail.com') {
	          session.admin = true;
	        }
	        promise.fulfill(googleUser);
	    })
	    return promise;
	})
	.redirectPath('/admin');

everyauth.everymodule.handleLogout(routes.user.logout);

everyauth.everymodule.findUserById( function (user, callback) {
	callback(user)
});

var app = express();
app.set('appName', 'myNode');

app.use(function(req, res, next) {
	if (!collections.users) return next(new Error("No collections."))
		req.collections = collections;
	return next();
});

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Express.js middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}))
app.use(everyauth.middleware());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//Authentication middleware
app.use(function(req, res, next) {
	if (req.session && req.session.admin)
		res.locals.admin = true;
	next();
});

//authorization
var authorize = function(req, res, next) {
  if (req.session && req.session.admin)
    return next();
  else
    return res.send(401);
};

//development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/admin', routes.user.admin);
app.get('/user', routes.user.user);

app.all('*', function(req, res) {
  res.send(404);
});

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function(){
    console.info('Express server listening on port ' + app.get('port'));
  });
}

var shutdown = function() {
  server.close();
}

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}