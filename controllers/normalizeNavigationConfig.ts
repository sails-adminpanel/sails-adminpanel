import {WidgetHelper} from "../helper/widgetHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {NavigationOptionsField} from "../interfaces/adminpanelConfig";

export default async function normalizeNavigationConfig(req, res) {

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`update-${req.param("entityName")}-${req.param("entityType")}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let editNavigationWidgetConfig: NavigationOptionsField = sails.config.adminpanel[`${req.param("entityType")}s`][req.param("entityName")].fields[req.body.key].options;

    let normalizedConfig = await WidgetHelper.editNavigationConfigNormalize(editNavigationWidgetConfig);

    return res.send(normalizedConfig);
};
