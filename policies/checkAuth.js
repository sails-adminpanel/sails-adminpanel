module.exports = async function (req, res, proceed) {
    if (!sails.config.adminpanel.auth && !req.session.UserAP) {
        req.session.UserAP = {
            id: "auth-false",
            isAdministrator: true
        };
    }
    return proceed();
};
