module.exports = async function (req, res, proceed) {
    if (!sails.config.adminpanel.auth) {
        if (req.session.UserAP) {
            req.session.UserAP.isAdministrator = true;
        } else {
            req.session.UserAP = {
                id: "auth-false",
                isAdministrator: true
            }
        }
    }
    return proceed()
}
