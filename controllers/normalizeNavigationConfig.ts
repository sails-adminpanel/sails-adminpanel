import {WidgetHelper} from "../helper/widgetHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {NavigationOptionsField} from "../interfaces/adminpanelConfig";

export default async function normalizeNavigationConfig(req, res) {

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`update-${req.param("entityName")}-${req.param("entityType")}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let editNavigationWidgetConfig: NavigationOptionsField;
    if (req.param("entityType") === "model") {
        editNavigationWidgetConfig = sails.config.adminpanel[`${req.param("entityType")}s`][req.param("entityName")].fields[req.body.key].options;
    } else {
        editNavigationWidgetConfig = sails.config.adminpanel[`${req.param("entityType")}s`].data[req.param("entityName")][req.body.key].options;
    }

    let normalizedConfig = await WidgetHelper.editNavigationConfigNormalize(editNavigationWidgetConfig);

    return res.send(normalizedConfig);
};
