import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import { AccessRightsToken } from "../interfaces/types";

export default async function editGroup(req: ReqType, res: ResType) {

    let entity = AdminUtil.findEntityObject(req);

    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`update-${entity.name}-model`, req.session.UserAP)) {
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
        adminizer.log.error(e)
    }

    let group;
    try {
        group = await GroupAP.findOne(req.param('id')).populate("users");
    } catch(e) {
        adminizer.log.error('Admin edit error: ');
        adminizer.log.error(e);
        return res.serverError();
    }

    let departments = AccessRightsHelper.getAllDepartments();
    let groupedTokens: {
        [key: string]:  AccessRightsToken[]
    } = {}

    for (let department of departments) {
        groupedTokens[department] = AccessRightsHelper.getTokensByDepartment(department)
    }

    let reloadNeeded = false;
    if (req.method.toUpperCase() === 'POST') {
        // console.log(req.body);

        let allTokens = AccessRightsHelper.getTokens();

        let usersInThisGroup = [];
        let tokensOfThisGroup = [];
        for (let key in req.body) {
            if (key.startsWith("user-checkbox-") && req.body[key] === "on") {
                for (let user of users) {
                    if (user.id == parseInt(key.slice(14))) {
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
            adminizer.log.debug(`Group was updated: `, updatedGroup);
            req.session.messages.adminSuccess.push('Group was updated !');
        } catch (e) {
            adminizer.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }

        reloadNeeded = true;
    }

    if (reloadNeeded) {
        try {
            group = await GroupAP.findOne(req.param('id')).populate("users");
        } catch (e) {
            adminizer.log.error('Admin edit error: ');
            adminizer.log.error(e);
            return res.serverError();
        }

        try {
            users = await UserAP.find({isAdministrator: false}).populate("groups");
        } catch (e) {
            adminizer.log.error(e)
        }
    }

    // console.log("GROUP", group)

    return res.viewAdmin("editGroup", { entity: entity, group: group, users: users, groupedTokens: groupedTokens });
};
