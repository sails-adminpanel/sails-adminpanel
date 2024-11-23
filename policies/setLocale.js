"use strict";
module.exports = async function (req, res, proceed) {
    if (!sails.hooks.i18n) {
        return proceed();
    }
    if (typeof adminizer.config.translation === 'boolean') {
        return proceed();
    }
    if (req.session.UserAP && req.session.UserAP.locale) {
        req.setLocale(req.session.UserAP.locale);
    }
    else {
        req.setLocale(adminizer.config.translation.defaultLocale);
    }
    return proceed();
};
