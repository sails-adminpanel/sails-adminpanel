"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
async function register(req, res) {
    if (!sails.config.adminpanel.auth || sails.config.adminpanel.registration?.enable !== true) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/`);
    }
    if (req.method.toUpperCase() === "POST") {
        console.log("req.body", req.body);
        if (!req.body.login || !req.body.fullName || !req.body.password) {
            return res.serverError("Missing required parameters");
        }
        let user;
        try {
            user = await UserAP.findOne({ login: req.body.login });
        }
        catch (e) {
            return res.serverError(e);
        }
        if (user) {
            req.session.messages.adminError.push("This login is already registered, please try another one");
            return res.viewAdmin("register");
        }
        else {
            try {
                await UserAP.create({ login: req.body.login, password: req.body.password, fullName: req.body.fullName, email: req.body.email, locale: req.body.locale }).fetch();
                return res.redirect(`${sails.config.adminpanel.routePrefix}/`);
            }
            catch (e) {
                return res.serverError(e);
            }
        }
    }
    if (req.method.toUpperCase() === "GET") {
        return res.viewAdmin("register");
    }
}
;
