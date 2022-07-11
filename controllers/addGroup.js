"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function addGroup(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let users;
    try {
        users = await UserAP.find({ isAdministrator: false });
    }
    catch (e) {
        sails.log.error(e);
    }
    let departments = accessRightsHelper_1.AccessRightsHelper.getAllDepartments();
    let groupedTokens = {};
    for (let department of departments) {
        groupedTokens[department] = accessRightsHelper_1.AccessRightsHelper.getTokensByDepartment(department);
    }
    if (req.method.toUpperCase() === 'POST') {
        console.log(req.body);
        let allTokens = accessRightsHelper_1.AccessRightsHelper.getTokens();
        let usersInThisGroup = [];
        let tokensOfThisGroup = [];
        for (let key in req.body) {
            if (key.startsWith("user-checkbox-") && req.body[key] === "on") {
                for (let user of users) {
                    if (user.id == key.slice(14)) {
                        usersInThisGroup.push(user.id);
                    }
                }
            }
            if (key.startsWith("token-checkbox-") && req.body[key] === "on") {
                for (let token of allTokens) {
                    if (token.id == key.slice(15)) {
                        tokensOfThisGroup.push(token.id);
                    }
                }
            }
        }
        let group;
        try {
            group = await GroupAP.create({ name: req.body.name, description: req.body.description,
                users: usersInThisGroup, tokens: tokensOfThisGroup }).fetch();
            sails.log(`A new group was created: `, group);
            req.session.messages.adminSuccess.push('A new group was created !');
            return res.redirect(`${sails.config.adminpanel.routePrefix}/groupsap`);
        }
        catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }
        console.log(group);
    }
    return res.viewAdmin("addGroup", { entity: entity, users: users, groupedTokens: groupedTokens });
}
exports.default = addGroup;
;
