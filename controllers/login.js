"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const POWCaptcha_1 = require("../lib/v4/POWCaptcha");
let passwordHash = require("password-hash");
async function login(req, res) {
    const powCaptcha = new POWCaptcha_1.POWCaptcha();
    if (req.url.indexOf("login") >= 0) {
        if (!adminizer.config.auth) {
            return res.redirect(`${adminizer.config.routePrefix}/`);
        }
        if (req.method.toUpperCase() === "POST") {
            let login = req.param("login");
            let password = req.param("password");
            let captchaSolution = req.param("captchaSolution");
            console.log("captchaSolution", captchaSolution);
            // Verify CAPTCHA solution
            const isCaptchaValid = powCaptcha.check(captchaSolution, `login:${req.ip}`);
            if (!isCaptchaValid) {
                return await viewAdminMessage(req, res, "Invalid CAPTCHA solution");
            }
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
                return await viewAdminMessage(req, res, "Wrong username or password");
            }
            else {
                if (adminizer.config.registration.confirmationRequired && !user.isConfirmed && !user.isAdministrator) {
                    return await viewAdminMessage(req, res, "Profile is not confirmed, please contact to administrator");
                }
                if (passwordHash.verify(login + password, user.passwordHashed)) {
                    if (user.expires && Date.now() > Date.parse(user.expires)) {
                        return await viewAdminMessage(req, res, "Profile expired, contact the administrator");
                    }
                    req.session.UserAP = user;
                    return res.redirect(`${adminizer.config.routePrefix}/`);
                }
                else {
                    return await viewAdminMessage(req, res, "Wrong username or password");
                }
            }
        }
        if (req.method.toUpperCase() === "GET") {
            // Generate new CAPTCHA job
            const captchaTask = await powCaptcha.getJob(`login:${req.ip}`);
            return res.viewAdmin("login", { captchaTask: captchaTask });
        }
    }
    else if (req.url.indexOf("logout") >= 0) {
        if (req.session.adminPretender && req.session.adminPretender.id && req.session.UserAP && req.session.UserAP.id) {
            req.session.UserAP = req.session.adminPretender;
            req.session.adminPretender = {};
            return res.redirect(`${adminizer.config.routePrefix}/`);
        }
        req.session.UserAP = undefined;
        res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }
}
async function viewAdminMessage(req, res, message) {
    const powCaptcha = new POWCaptcha_1.POWCaptcha();
    const captchaTask = await powCaptcha.getJob(`login:${req.ip}`);
    req.session.messages.adminError.push(message);
    return res.viewAdmin("login", { captchaTask: captchaTask });
}
