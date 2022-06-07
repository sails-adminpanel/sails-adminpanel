import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function(req, res) {

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

    let user;
    try {
        user = await UserAP.findOne(req.param('id')).populate("groups");
    } catch(e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }

    let groups;
    try {
        groups = await GroupAP.find();
    } catch (e) {
        sails.log.error(e)
    }

    let reloadNeeded = false;
    if (req.method.toUpperCase() === 'POST') {
        console.log(req.body);

        let userGroups = [];
        for (let key in req.body) {
            if (key.startsWith("group-checkbox-") && req.body[key] === "on") {
                for (let group of groups) {
                    if (group.id == key.slice(15)) {
                        userGroups.push(group.id)
                    }
                }
            }
        }

        let locale = req.body.locale === 'default' ? sails.config.adminpanel.translation.defaultLocale : req.body.locale;

        let updatedUser;
        try {
            updatedUser = await UserAP.update({id: user.id}, {login: req.body.login, fullName: req.body.fullName,
                email: req.body.email, password: req.body.userPassword, timezone: req.body.timezone, expires: req.body.date,
                locale: locale, groups: userGroups}).fetch();
            sails.log(`User was updated: `, updatedUser);
            req.session.messages.adminSuccess.push('User was updated !');
        } catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
        }

        reloadNeeded = true;
    }

    if (reloadNeeded) {
        try {
            user = await UserAP.findOne(req.param('id')).populate("groups");
        } catch (e) {
            req._sails.log.error('Admin edit error: ');
            req._sails.log.error(e);
            return res.serverError();
        }

        try {
            groups = await GroupAP.find();
        } catch (e) {
            sails.log.error(e)
        }
    }

    return res.viewAdmin("editUser", { instance: instance, user: user, groups: groups });
};
