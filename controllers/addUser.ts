import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function(req: ReqTypeAP, res: ResTypeAP) {

    let entity = AdminUtil.findEntityObject(req);

    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let groups;
    try {
        groups = await GroupAP.find();
    } catch (e) {
        adminizer.log.error(e)
    }

    if (req.method.toUpperCase() === 'POST') {
        // console.log(req.body);

        let userGroups = [];
        for (let key in req.body) {
            if (key.startsWith("group-checkbox-") && req.body[key] === "on") {
                for (let group of groups) {
                    if (group.id == parseInt(key.slice(15))) {
                        userGroups.push(group.id)
                    }
                }
            }
        }

        let isAdministrator = req.body.isAdmin === "on";
        let isConfirmed = req.body.isConfirmed === "on";

        let locale: string
        if(typeof adminizer.config.translation !== "boolean") {
            locale = req.body.locale === 'default' ? adminizer.config.translation.defaultLocale : req.body.locale;
        }


        let user;
        try {
            user = await UserAP.create({login: req.body.login, fullName: req.body.fullName, email: req.body.email,
                password: req.body.userPassword, timezone: req.body.timezone, expires: req.body.date,
                locale: locale, isAdministrator: isAdministrator, isConfirmed: isConfirmed, groups: userGroups}).fetch()
            adminizer.log.debug(`A new user was created: `, user);
            req.session.messages.adminSuccess.push('A new user was created !');
            return res.redirect(`${adminizer.config.routePrefix}/model/userap`);
        } catch (e) {
            adminizer.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }

        // console.log(user)
    }

    return res.viewAdmin("addUser", { entity: entity, groups: groups });
};
