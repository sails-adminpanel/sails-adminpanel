import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {MigrationsHelper} from "../helper/migrationsHelper";

export default async function processMigrations(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`process-migrations`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let action = req.query.action;
    if (action !== "up" && action !== "down") {
        return res.badRequest();
    }

    if (typeof sails.config.adminpanel.migrations === "boolean" || !sails.config.adminpanel.migrations.path) {
        throw "Migrations directory is not defined";
    }

    try {
        let result = await MigrationsHelper.processSpecificDirectoryMigrations(sails.config.adminpanel.migrations.path, action);
        return res.send(result);
    } catch (e) {
        return res.serverError(e)
    }
};
