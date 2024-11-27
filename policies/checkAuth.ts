module.exports = async function (req: ReqType, res: ResType, proceed: ()=>void) {
    let locale: string = ""
    
    if (typeof adminizer.config.translation  !== 'boolean') {
        locale = adminizer.config.translation.defaultLocale
    }

    if (!adminizer.config.auth) {
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
