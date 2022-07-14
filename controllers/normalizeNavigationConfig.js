"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widgetHelper_1 = require("../helper/widgetHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function normalizeNavigationConfig(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${req.param("entityName")}-${req.param("entityType")}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let editNavigationWidgetConfig;
    if (req.param("entityType") === "model") {
        editNavigationWidgetConfig = sails.config.adminpanel[`${req.param("entityType")}s`][req.param("entityName")].fields[req.body.key].options;
    }
    else {
        editNavigationWidgetConfig = sails.config.adminpanel[`${req.param("entityType")}s`].data[req.param("entityName")][req.body.key].options;
    }
    let normalizedConfig = await widgetHelper_1.WidgetHelper.editNavigationConfigNormalize(editNavigationWidgetConfig);
    return res.send(normalizedConfig);
}
exports.default = normalizeNavigationConfig;
;
