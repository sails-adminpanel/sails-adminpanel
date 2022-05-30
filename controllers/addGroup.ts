import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function addGroup(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

    let users;
    try {
        users = await UserAP.find({isAdministrator: false});
    } catch (e) {
        sails.log.error(e)
    }

    let departments = AccessRightsHelper.getAllDepartments();
    let groupedTokens = {}

    for (let department of departments) {
        groupedTokens[department] = AccessRightsHelper.getTokensByDepartment(department)
    }

    if (req.method.toUpperCase() === 'POST') {
        console.log(req.body);

        let allTokens = AccessRightsHelper.getTokens();

        let usersInThisGroup = [];
        let tokensOfThisGroup = [];
        for (let key in req.body) {
            if (key.startsWith("user-checkbox-") && req.body[key] === "on") {
                for (let user of users) {
                    if (user.id == key.slice(14)) {
                        usersInThisGroup.push(user.id)
                    }
                }
            }

            if (key.startsWith("token-checkbox-") && req.body[key] === "on") {
                for (let token of allTokens) {
                    if (token.id == key.slice(15)) {
                        tokensOfThisGroup.push(token.id)
                    }
                }
            }
        }

        let group;
        try {
            group = await GroupAP.create({name: req.body.name, description: req.body.description,
                users: usersInThisGroup, tokens: tokensOfThisGroup}).fetch()
        } catch (e) {
            sails.log.error(e)
        }

        console.log(group)
    }

    return res.viewAdmin("addGroup", { instance: instance, users: users, groupedTokens: groupedTokens });
};
