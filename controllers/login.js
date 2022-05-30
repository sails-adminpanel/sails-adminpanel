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
            if (!user) {
                req.flash("adminError", "Wrong username or password");
                return res.viewAdmin("login");
            }
            else {
                console.log(login, password);
                console.log(passwordHash.generate(login + password));
                console.log(passwordHash.generate(login + password));
                console.log(passwordHash.generate(login + password));
                if (passwordHash.verify(login + password, user.passwordHashed)) {
                    req.session.UserAP = user;
                    return res.redirect("/admin/");
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
        req.session.UserAP = undefined;
        res.redirect("/admin/userap/login");
    }
}
exports.default = login;
;
