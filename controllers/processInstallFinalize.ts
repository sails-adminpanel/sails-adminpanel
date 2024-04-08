import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {InstallStepper} from "../lib/installStepper/installStepper";

export default async function processInstallStep(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    return res.json(InstallStepper.getFinalizeStatus())
    // TODO тут нужно разрендерить вьюху (какую? если finalize.ejs это только partial, то что мы рендерим?)
    // TODO этот контроллер вообще можно удалить, он бессполезный, на него мы идем из основного.
    //  И с вьюхи можем идти на основной и там забирать getFinalizeStatus
    // return res.viewAdmin(`installer/${renderer}`, renderData);
};
