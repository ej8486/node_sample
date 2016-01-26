exports.user = require('./user');
exports.home = require('./home');
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {msg: 'Welcome to the Practical Node.js!'});
};