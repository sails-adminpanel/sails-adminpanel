module.exports = async function (req, res, proceed) {
    if (!sails.adminpanel.havePermission()) {
        if (req.originalUrl !== '/admin/userap/login') {
            return res.redirect('/admin/userap/login');
        }
    }

    if (sails.config.adminpanel.auth && req.originalUrl !== '/admin/userap/login') {
        req.locals.user = req.session.UserAP;
    }
    return proceed()
}
