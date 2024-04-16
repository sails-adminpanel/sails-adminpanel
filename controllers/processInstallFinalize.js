"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const installStepper_1 = require("../lib/installStepper/installStepper");
async function processInstallStep(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    sails.log.debug("IN PROCESS FINALIZE", installStepper_1.InstallStepper.getFinalizeStatus());
    return res.json(installStepper_1.InstallStepper.getFinalizeStatus());
}
exports.default = processInstallStep;
;
