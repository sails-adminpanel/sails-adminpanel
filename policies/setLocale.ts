module.exports = async function (req: ReqType, res: ResType, proceed: ()=>void) {
    if (!sails.hooks.i18n) {
        return proceed();
    }

    if (typeof sails.config.adminpanel.translation  === 'boolean') {
        return proceed();
    }

    if (req.session.UserAP && req.session.UserAP.locale) {
        req.setLocale(req.session.UserAP.locale);
    } else {
        req.setLocale(sails.config.adminpanel.translation.defaultLocale);
    }
    return proceed()
}
