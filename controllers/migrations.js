"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function migrations(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`migrations`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    if (typeof sails.config.adminpanel.migrations === "boolean" || !fs.existsSync(sails.config.adminpanel.migrations.path)) {
        return res.status(404).send("Check migrations path in configuration");
    }
    let migrationsLastResult;
    if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
        migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
    }
    return res.viewAdmin('migrations', { entity: "entity", section: 'migrations', migrationsInfo: migrationsLastResult });
}
exports.default = migrations;
