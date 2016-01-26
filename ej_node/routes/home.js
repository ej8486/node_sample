exports.main = function(req, res, next) {
	if (req.session.admin) {
		res.redirect('/admin');
	} else {
		res.render('home/main');
	}
};