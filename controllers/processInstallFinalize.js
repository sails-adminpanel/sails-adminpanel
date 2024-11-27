"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = processInstallFinalize;
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const installStepper_1 = require("../lib/installStepper/installStepper");
let installStepper = installStepper_1.InstallStepper.getInstance();
async function processInstallFinalize(req, res) {
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    adminizer.log.debug("IN PROCESS FINALIZE", installStepper.getFinalizeStatus());
    return res.json(installStepper.getFinalizeStatus());
}
;
