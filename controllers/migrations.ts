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
        return res.notFound();
    }

    let migrationsLastResult;
    if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
        migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
    }

    return res.viewAdmin('migrations', { entity: "entity", migrationsInfo: migrationsLastResult });
}
