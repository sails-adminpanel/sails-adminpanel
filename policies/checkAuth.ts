module.exports = async function (req, res, proceed) {
    let locale: string = ""
    
    if (typeof sails.config.adminpanel.translation  !== 'boolean') {
        locale = sails.config.adminpanel.translation.defaultLocale
    }

    if (!sails.config.adminpanel.auth) {
        if (req.session.UserAP) {
            req.session.UserAP.isAdministrator = true;
        } else {
            req.session.UserAP = {
                id: "auth-false",
                isAdministrator: true,
                locale: locale
            }
        }
    }
    return proceed()
}
