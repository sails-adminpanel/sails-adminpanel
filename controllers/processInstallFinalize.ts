import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {InstallStepper} from "../lib/installStepper/installStepper";
let installStepper = InstallStepper.getInstance();

export default async function processInstallFinalize(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    sails.log.debug("IN PROCESS FINALIZE", installStepper.getFinalizeStatus());
    return res.json(installStepper.getFinalizeStatus())
};
