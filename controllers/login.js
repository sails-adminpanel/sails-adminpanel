"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let passwordHash = require("password-hash");
async function login(req, res) {
    if (req.url.indexOf("login") >= 0) {
        if (req.method.toUpperCase() === "POST") {
            let login = req.param("login");
            let password = req.param("password");
            let user;
            try {
                user = await UserAP.findOne({ login: login }).populate("groups");
            }
            catch (e) {
                return res.serverError(e);
            }
            if (req.body.pretend) {
                if (!user) {
                    return res.sendStatus(404);
                }
                if (req.session.UserAP.isAdministrator) {
                    req.session.adminPretender = req.session.UserAP;
                    req.session.UserAP = user;
                    return res.sendStatus(200);
                }
            }
            if (!user) {
                req.flash("adminError", "Wrong username or password");
                return res.viewAdmin("login");
            }
            else {
                if (passwordHash.verify(login + password, user.passwordHashed)) {
                    if (Date.now() > Date.parse(user.expires)) {
                        req.flash("adminError", "Profile expired, contact the administrator");
                        return res.viewAdmin("login");
                    }
                    req.session.UserAP = user;
                    return res.redirect(`${sails.config.adminpanel.routePrefix}/`);
                }
                else {
                    req.flash("adminError", "Wrong username or password");
                    return res.viewAdmin("login");
                }
            }
        }
        if (req.method.toUpperCase() === "GET") {
            return res.viewAdmin("login");
        }
    }
    else if (req.url.indexOf("logout") >= 0) {
        if (req.session.adminPretender && req.session.adminPretender.id && req.session.UserAP && req.session.UserAP.id) {
            req.session.UserAP = req.session.adminPretender;
            req.session.adminPretender = {};
            return res.redirect(`${sails.config.adminpanel.routePrefix}/`);
        }
        req.session.UserAP = undefined;
        res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
    }
}
exports.default = login;
;
