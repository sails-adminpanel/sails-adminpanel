import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function(req: ReqType, res: ResType) {

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

    let user;
    try {
        user = await UserAP.findOne(req.param('id')).populate("groups");
    } catch(e) {
        adminizer.log.error('Admin edit error: ');
        adminizer.log.error(e);
        return res.serverError();
    }

    let groups;
    try {
        groups = await GroupAP.find();
    } catch (e) {
        adminizer.log.error(e)
    }

    let reloadNeeded = false;
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

        let updatedUser;
        try {
            updatedUser = await UserAP.update({id: user.id}, {login: req.body.login, fullName: req.body.fullName,
                email: req.body.email, timezone: req.body.timezone, expires: req.body.date,
                locale: locale, isAdministrator: isAdministrator, isConfirmed: isConfirmed, groups: userGroups}).fetch();
            if (req.body.userPassword) {
                updatedUser = await UserAP.update({id: user.id}, {login: req.body.login, password: req.body.userPassword}).fetch();
            }
            adminizer.log.debug(`User was updated: `, updatedUser);
            req.session.messages.adminSuccess.push('User was updated !');
        } catch (e) {
            adminizer.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }

        reloadNeeded = true;
    }

    if (reloadNeeded) {
        try {
            user = await UserAP.findOne(req.param('id')).populate("groups");
        } catch (e) {
            adminizer.log.error('Admin edit error: ');
            adminizer.log.error(e);
            return res.serverError();
        }

        try {
            groups = await GroupAP.find();
        } catch (e) {
            adminizer.log.error(e)
        }
    }

    return res.viewAdmin("editUser", { entity: entity, user: user, groups: groups });
};
