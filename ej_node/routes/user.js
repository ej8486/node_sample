
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
	if (req.session.user != null) {
		if (req.session.admin) {
			res.redirect('/admin');
		} else {
			res.redirect('/user');
		}
	} else {
		res.render('login/login');
	}
};

/*
 * GET logout route.
 */

exports.logout = function(req, res, next) {
	req.session.user = null;
    req.session.admin = false;
    
	res.redirect('/login');
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
	
	req.collections.users.findOne({email : req.body.lgnId}, function(error, user) {
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
		} 
		res.send({loginFlag: loginFlag});
	});
};

exports.admin = function(req, res, next) {
	if (req.session.admin) {
		res.render('login/admin');
	} else {
		res.redirect('/login');
	}
};

exports.user = function(req, res, next) {
	res.render('login/user');
};