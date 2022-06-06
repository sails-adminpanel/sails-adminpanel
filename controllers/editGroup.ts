import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function editGroup(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`update-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

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

    let reloadNeeded = false;
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

        let updatedGroup;
        try {
            updatedGroup = await GroupAP.update({id: group.id}, {name: req.body.name, description: req.body.description,
                users: usersInThisGroup, tokens: tokensOfThisGroup}).fetch();
            sails.log(`Group was updated: `, updatedGroup);
            req.flash('adminSuccess', 'Group was updated !');
        } catch (e) {
            sails.log.error(e);
            req.flash('adminError', e.message || 'Something went wrong...');
        }

        reloadNeeded = true;
    }

    if (reloadNeeded) {
        try {
            group = await GroupAP.findOne(req.param('id')).populate("users");
        } catch (e) {
            req._sails.log.error('Admin edit error: ');
            req._sails.log.error(e);
            return res.serverError();
        }

        try {
            users = await UserAP.find({isAdministrator: false}).populate("groups");
        } catch (e) {
            sails.log.error(e)
        }
    }

    console.log("GROUP", group)

    return res.viewAdmin("editGroup", { instance: instance, group: group, users: users, groupedTokens: groupedTokens });
};
