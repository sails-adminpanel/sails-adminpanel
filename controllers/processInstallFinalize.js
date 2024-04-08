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
    console.log("IN PROCESS FINALIZE");
    console.log(installStepper_1.InstallStepper.getFinalizeStatus());
    return res.json(installStepper_1.InstallStepper.getFinalizeStatus());
    // TODO тут нужно разрендерить вьюху (какую? если finalize.ejs это только partial, то что мы рендерим?)
    // TODO этот контроллер вообще можно удалить, он бессполезный, на него мы идем из основного.
    //  И с вьюхи можем идти на основной и там забирать getFinalizeStatus
    // return res.viewAdmin(`installer/${renderer}`, renderData);
}
exports.default = processInstallStep;
;
