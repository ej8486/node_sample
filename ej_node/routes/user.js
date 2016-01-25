
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send('respond with a resource');
};


/*
 * GET login page.
 */

exports.login = function(req, res, next) {
  res.render('login/login');
};

/*
 * GET logout route.
 */

exports.logout = function(req, res, next) {

  res.redirect('/');
};


/*
 * POST authenticate route.
 */

exports.authenticate = function(req, res, next) {
	var loginFlag = false;
	var adminFlag = false;
	
	if (!req.body.lgnId || !req.body.password) {
		return res.render('login/login', {error: 'Please enter your email and password.'});
	}
	
	req.collections.users.findOne({lgnid : req.body.lgnId}, function(error, user) {
		if (error) return next(error);
		if (user) {
			if (req.body.password == user.password) {
				loginFlag = true;
			}
			
			if (user.admin) {
				adminFlag = true;
			}
			req.session.user = user;
		    req.session.admin = adminFlag;
		    console.log(adminFlag);
		    res.send({loginFlag: loginFlag});
		}
	});
	
};

exports.admin = function(req, res, next) {
	if (req.session.admin) {
		res.render('login/admin');
	} else {
		res.redirect('/login');
	}
};
