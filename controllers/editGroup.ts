import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function editGroup(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }

    let users;
    try {
        users = await UserAP.find({isAdministrator: false}).populate("groups");
    } catch (e) {
        sails.log.error(e)
    }

    let group;
    try {
        group = await GroupAP.findOne(req.param('id')).populate("users");
    } catch(e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }

    let departments = AccessRightsHelper.getAllDepartments();
    let groupedTokens = {}

    for (let department of departments) {
        groupedTokens[department] = AccessRightsHelper.getTokensByDepartment(department)
    }

    if (req.method.toUpperCase() === 'POST') {
        console.log(req.body);

        let usersInThisGroup = [];
        for (let key in req.body) {
            if (key.startsWith("checkbox-") && req.body[key] === "on") {
                for (let user of users) {
                    if (user.id === key.slice(9)) {
                        usersInThisGroup.push(user.id)
                    }
                }
            }
        }

        let group;
        try {
            group = await GroupAP.create({name: req.body.name, description: req.body.description, users: usersInThisGroup}).fetch()
        } catch (e) {
            sails.log.error(e)
        }

        console.log(group)
    }

    return res.viewAdmin("editGroup", { instance: instance, group: group, users: users, groupedTokens: groupedTokens });
};
