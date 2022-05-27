"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function addGroup(req, res) {
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
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
        let usersInThisGroup = [];
        for (let key in req.body) {
            if (key.startsWith("checkbox-") && req.body[key] === "on") {
                for (let user of users) {
                    if (user.id === key.slice(9)) {
                        usersInThisGroup.push(user.id);
                    }
                }
            }
        }
        let group;
        try {
            group = await GroupAP.create({ name: req.body.name, description: req.body.description, users: usersInThisGroup }).fetch();
        }
        catch (e) {
            sails.log.error(e);
        }
        console.log(group);
    }
    return res.viewAdmin("addGroup", { instance: instance, users: users, groupedTokens: groupedTokens });
}
exports.default = addGroup;
;
