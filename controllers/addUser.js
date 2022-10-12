"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function default_1(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
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
        // console.log(req.body);
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
        let isAdministrator = req.body.isAdmin === "on";
        let locale;
        if (typeof sails.config.adminpanel.translation !== "boolean") {
            locale = req.body.locale === 'default' ? sails.config.adminpanel.translation.defaultLocale : req.body.locale;
        }
        let user;
        try {
            user = await UserAP.create({ login: req.body.login, fullName: req.body.fullName, email: req.body.email,
                password: req.body.userPassword, timezone: req.body.timezone, expires: req.body.date,
                locale: locale, isAdministrator: isAdministrator, groups: userGroups }).fetch();
            sails.log(`A new user was created: `, user);
            req.session.messages.adminSuccess.push('A new user was created !');
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/usersap`);
        }
        catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }
        // console.log(user)
    }
    return res.viewAdmin("addUser", { entity: entity, groups: groups });
}
exports.default = default_1;
;
