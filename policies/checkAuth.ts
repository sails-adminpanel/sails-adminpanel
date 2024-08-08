module.exports = async function (req: ReqType, res: ResType, proceed: Function) {
    let locale: string = ""
    
    if (typeof sails.config.adminpanel.translation  !== 'boolean') {
        locale = sails.config.adminpanel.translation.defaultLocale
    }

    if (!sails.config.adminpanel.auth) {
        if (req.session.UserAP) {
            req.session.UserAP.isAdministrator = true;
        } else {
            req.session.UserAP = {
                id: 0,
                isAdministrator: true,
                locale: locale
            }
        }
    }
    return proceed()
}
