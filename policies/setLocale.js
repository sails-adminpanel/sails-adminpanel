module.exports = async function (req, res, proceed) {
    if (req.session.UserAP && req.session.UserAP.locale) {
        req.setLocale(req.session.UserAP.locale);
    }
    else {
        req.setLocale(sails.hooks.i18n.defaultLocale);
    }
    return proceed();
};
