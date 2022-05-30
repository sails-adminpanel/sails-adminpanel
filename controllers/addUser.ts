import {AdminUtil} from "../lib/adminUtil";
import {havePermission} from "../lib/bindAuthorization";

export default async function(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect("/admin/userap/login");
        } else if (!havePermission(`create-${instance.name}-instance`, req.session.UserAP)) {
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

        let user;
        try {
            user = await UserAP.create({login: req.body.login, fullName: req.body.fullName, email: req.body.email,
                password: req.body.userPassword, timezone: req.body.timezone, expires: req.body.date,
                locale: req.body.locale, groups: userGroups}).fetch()
        } catch (e) {
            sails.log.error(e)
        }

        console.log(user)
    }

    return res.viewAdmin("addUser", { instance: instance, groups: groups });
};
