'use strict';

var passwordHash = require('password-hash');
var created = false;

module.exports = function(req, res) {
    if (req.url.indexOf('login') >= 0) {
        if (req.method.toUpperCase() === 'POST') {
            var username = req.param('username');
            var password = req.param('password');
            UserAP.findOne({username: username}).exec((err, user) => {
                if (err) return res.serverError(err);
                if (!user) {
                    req.flash('adminError','Wrong username or password');
                    return res.viewAdmin('login');
                } else {   
                    if (passwordHash.verify(username + password, user.passwordHashed)) {
                        req.session.UserAP = user;
                        return res.redirect('/admin/');
                    } else {
                        req.flash('adminError','Wrong username or password');
                        return res.viewAdmin('login');
                    }
                }
            });
        }
    } else if (req.url.indexOf('logout') >= 0) {
        req.session.UserAP = undefined;
        res.redirect('/admin/userap/login');
    }
};
