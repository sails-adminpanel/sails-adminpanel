import {AdminUtil} from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`create-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let groups;
    try {
        groups = await GroupAP.find();
    } catch (e) {
        sails.log.error(e)
    }

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

        let user;
        try {
            user = await UserAP.create({login: req.body.login, fullName: req.body.fullName, email: req.body.email,
                password: req.body.userPassword, timezone: req.body.timezone, expires: req.body.date,
                locale: locale, groups: userGroups}).fetch()
            sails.log(`A new user was created: `, user);
            req.flash('adminSuccess', 'A new user was created !');
            return res.redirect(`${sails.config.adminpanel.routePrefix}/users`);
        } catch (e) {
            sails.log.error(e);
            req.flash('adminError', e.message || 'Something went wrong...');
        }

        console.log(user)
    }

    return res.viewAdmin("addUser", { instance: instance, groups: groups });
};
