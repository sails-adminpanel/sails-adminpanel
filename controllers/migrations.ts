import * as fs from "fs";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default function migrations(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`migrations`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    if (typeof sails.config.adminpanel.migrations === "boolean" || !fs.existsSync(sails.config.adminpanel.migrations.path)) {
        return res.status(404).send("Check migrations path in configuration");
    }

    return res.viewAdmin('migrations', { entity: "entity", section: 'migrations' });
}
