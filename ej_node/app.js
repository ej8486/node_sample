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
	.findOrCreateUser( function (session, accessToken, accessTokenSecret, googleUserMetadata) {
		var promise = this.Promise();
		process.nextTick(function(){
	        if (googleUserMetadata.screen_name === 'EJ') {
	          session.user = googleUserMetadata;
	          session.admin = true;
	        }
	        promise.fulfill(googleUserMetadata);
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

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}))
app.use(everyauth.middleware());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/admin', routes.user.admin);

app.all('*', function(req, res) {
  res.send(404);
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

