"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function processMigrations(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    // TODO здесь выполнять processStep
}
exports.default = processMigrations;
;
