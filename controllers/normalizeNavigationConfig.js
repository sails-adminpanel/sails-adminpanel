"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = normalizeNavigationConfig;
const widgetHelper_1 = require("../helper/widgetHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function normalizeNavigationConfig(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
            return;
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${req.param("entityName")}-${req.param("entityType")}`, req.session.UserAP)) {
            res.sendStatus(403);
            return;
        }
    }
    let editNavigationWidgetConfig;
    let entityType = req.param("entityType");
    if (entityType === "model") {
        const entity = sails.config.adminpanel[`${entityType}s`][req.param("entityName")];
        if (typeof entity !== "boolean") {
            const fieldConfig = entity.fields[req.body.key];
            if (typeof fieldConfig !== "string" && typeof fieldConfig === "object" && 'options' in fieldConfig) {
                //@ts-ignore
                editNavigationWidgetConfig = fieldConfig.options;
            }
        }
    }
    else {
        const fieldConfig = sails.config.adminpanel[`${entityType}s`].data[req.param("entityName")][req.body.key];
        if (typeof fieldConfig === "object" && 'options' in fieldConfig) {
            //@ts-ignore
            editNavigationWidgetConfig = fieldConfig.options;
        }
    }
    let normalizedConfig = await widgetHelper_1.WidgetHelper.editNavigationConfigNormalize(editNavigationWidgetConfig);
    res.send(normalizedConfig);
    return;
}
;
