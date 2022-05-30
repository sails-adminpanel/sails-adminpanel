"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const bindAuthorization_1 = require("../lib/bindAuthorization");
async function default_1(req, res) {
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect("/admin/userap/login");
        }
        else if (!(0, bindAuthorization_1.havePermission)(`create-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let groups;
    try {
        groups = await GroupAP.find();
    }
    catch (e) {
        sails.log.error(e);
    }
    if (req.method.toUpperCase() === 'POST') {
        console.log(req.body);
        let userGroups = [];
        for (let key in req.body) {
            if (key.startsWith("group-checkbox-") && req.body[key] === "on") {
                for (let group of groups) {
                    if (group.id == key.slice(15)) {
                        userGroups.push(group.id);
                    }
                }
            }
        }
        let user;
        try {
            user = await UserAP.create({ login: req.body.login, fullName: req.body.fullName, email: req.body.email,
                password: req.body.userPassword, timezone: req.body.timezone, expires: req.body.date,
                locale: req.body.locale, groups: userGroups }).fetch();
        }
        catch (e) {
            sails.log.error(e);
        }
        console.log(user);
    }
    return res.viewAdmin("addUser", { instance: instance, groups: groups });
}
exports.default = default_1;
;
