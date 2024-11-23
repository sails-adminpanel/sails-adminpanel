"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initUser;
async function initUser(req, res) {
    if (!adminizer.config.auth) {
        return res.redirect(`${adminizer.config.routePrefix}/`);
    }
    let admins = await UserAP.find({ isAdministrator: true });
    if (admins.length) {
        res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }
    if (req.method.toUpperCase() === "POST") {
        let login = req.param("login");
        let locale = req.param("locale");
        let password = req.param("password");
        let confirm_password = req.param("confirm_password");
        sails.log.debug(login, password, confirm_password, 123);
        if (password !== confirm_password) {
            req.session.messages.adminError.push("Password mismatch");
            return res.viewAdmin("init_user");
        }
        try {
            sails.log.debug(`Created admin`);
            await UserAP.create({
                login: login,
                password: password,
                fullName: "Administrator",
                isActive: true,
                ...(locale !== undefined && { locale }),
                isAdministrator: true
            });
        }
        catch (e) {
            sails.log.error("Could not create administrator profile", e);
            req.session.messages.adminError.push("Could not create administrator profile");
            return res.viewAdmin("init_user");
        }
        return res.redirect(`${adminizer.config.routePrefix}/`);
    }
    if (req.method.toUpperCase() === "GET") {
        return res.viewAdmin("init_user");
    }
}
;
