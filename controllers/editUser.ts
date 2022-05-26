import {AdminUtil} from "../lib/adminUtil";

export default async function(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

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
            if (key.startsWith("checkbox-") && req.body[key] === "on") {
                for (let group of groups) {
                    if (group.id === key.slice(9)) {
                        userGroups.push(group.id)
                    }
                }
            }
        }

        let updatedUser;
        try {
            updatedUser = await UserAP.update({id: user.id}, {login: req.body.login, fullName: req.body.fullName,
                email: req.body.email, password: req.body.password, timezone: req.body.timezone, expires: req.body.data,
                locale: req.body.locale, groups: userGroups}).fetch()
        } catch (e) {
            sails.log.error(e)
        }

        reloadNeeded = true;
        console.log(updatedUser)
    }

    if (reloadNeeded) {
        try {
            user = await UserAP.findOne(req.param('id')).populate("groups");
        } catch (e) {
            req._sails.log.error('Admin edit error: ');
            req._sails.log.error(e);
            return res.serverError();
        }
    }

    console.log(user)
    console.log(groups)

    return res.viewAdmin("editUser", { instance: instance, user: user, groups: groups });
};
