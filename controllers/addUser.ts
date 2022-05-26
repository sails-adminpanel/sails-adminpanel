import {AdminUtil} from "../lib/adminUtil";

export default async function(req, res) {

    let instance = AdminUtil.findInstanceObject(req);

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
            if (key.startsWith("checkbox-") && req.body[key] === "on") {
                for (let group of groups) {
                    if (group.id === key.slice(9)) {
                        userGroups.push(group.id)
                    }
                }
            }
        }

        let user;
        try {
            user = await UserAP.create({login: req.body.login, fullName: req.body.fullName, email: req.body.email,
                password: req.body.password, timezone: req.body.timezone, expires: req.body.data,
                locale: req.body.locale, groups: userGroups}).fetch()
        } catch (e) {
            sails.log.error(e)
        }

        console.log(user)
    }

    return res.viewAdmin("addUser", { instance: instance, groups: groups });
};
