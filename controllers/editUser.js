"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function default_1(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    let user;
    try {
        user = await UserAP.findOne(req.param('id')).populate("groups");
    }
    catch (e) {
        sails.log.error('Admin edit error: ');
        sails.log.error(e);
        return res.serverError();
    }
    let groups;
    try {
        groups = await GroupAP.find();
    }
    catch (e) {
        sails.log.error(e);
    }
    let reloadNeeded = false;
    if (req.method.toUpperCase() === 'POST') {
        // console.log(req.body);
        let userGroups = [];
        for (let key in req.body) {
            if (key.startsWith("group-checkbox-") && req.body[key] === "on") {
                for (let group of groups) {
                    if (group.id == parseInt(key.slice(15))) {
                        userGroups.push(group.id);
                    }
                }
            }
        }
        let isAdministrator = req.body.isAdmin === "on";
        let isConfirmed = req.body.isConfirmed === "on";
        let locale;
        if (typeof sails.config.adminpanel.translation !== "boolean") {
            locale = req.body.locale === 'default' ? sails.config.adminpanel.translation.defaultLocale : req.body.locale;
        }
        let updatedUser;
        try {
            updatedUser = await UserAP.update({ id: user.id }, { login: req.body.login, fullName: req.body.fullName,
                email: req.body.email, timezone: req.body.timezone, expires: req.body.date,
                locale: locale, isAdministrator: isAdministrator, isConfirmed: isConfirmed, groups: userGroups }).fetch();
            if (req.body.userPassword) {
                updatedUser = await UserAP.update({ id: user.id }, { login: req.body.login, password: req.body.userPassword }).fetch();
            }
            sails.log.debug(`User was updated: `, updatedUser);
            req.session.messages.adminSuccess.push('User was updated !');
        }
        catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }
        reloadNeeded = true;
    }
    if (reloadNeeded) {
        try {
            user = await UserAP.findOne(req.param('id')).populate("groups");
        }
        catch (e) {
            sails.log.error('Admin edit error: ');
            sails.log.error(e);
            return res.serverError();
        }
        try {
            groups = await GroupAP.find();
        }
        catch (e) {
            sails.log.error(e);
        }
    }
    return res.viewAdmin("editUser", { entity: entity, user: user, groups: groups });
}
;
