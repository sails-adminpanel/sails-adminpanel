module.exports = async function (req, res, proceed) {
    if (!sails.adminpanel.havePermission()) {
        return res.redirect('/admin/userap/login');
    }
    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }
    return proceed();
};
