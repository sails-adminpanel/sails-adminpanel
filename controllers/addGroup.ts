import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import { AccessRightsToken } from "../interfaces/types";

export default async function addGroup(req: ReqType, res: ResType) {

    let entity = AdminUtil.findEntityObject(req);

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let users;
    try {
        users = await UserAP.find({isAdministrator: false});
    } catch (e) {
        sails.log.error(e)
    }

    let departments = AccessRightsHelper.getAllDepartments();

    let groupedTokens: {
        [key: string]:  AccessRightsToken[]
    } = {}

    for (let department of departments) {
        groupedTokens[department] = AccessRightsHelper.getTokensByDepartment(department)
    }

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

        let group;
        try {
            group = await GroupAP.create({name: req.body.name, description: req.body.description,
                users: usersInThisGroup, tokens: tokensOfThisGroup}).fetch()

            sails.log.debug(`A new group was created: `, group);
            req.session.messages.adminSuccess.push('A new group was created !');
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/groupsap`);
        } catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }

        // console.log(group)
    }

    return res.viewAdmin("addGroup", { entity: entity, users: users, groupedTokens: groupedTokens });
};
