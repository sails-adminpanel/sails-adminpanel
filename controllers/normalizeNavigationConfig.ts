import { WidgetHelper } from "../helper/widgetHelper";
import { AccessRightsHelper } from "../helper/accessRightsHelper";
import { NavigationOptionsField } from "../interfaces/adminpanelConfig";

export default async function normalizeNavigationConfig(req: ReqType, res: ResType): Promise<void> {

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
            return
        } else if (!AccessRightsHelper.havePermission(`update-${req.param("entityName")}-${req.param("entityType")}`, req.session.UserAP)) {
            res.sendStatus(403);
            return
        }
    }

    let editNavigationWidgetConfig: NavigationOptionsField;
    let entityType: 'model' | 'form' = req.param("entityType");

    if (entityType === "model") {
        const entity = sails.config.adminpanel[`${entityType}s`][req.param("entityName")];
        if (typeof entity !== "boolean") {
            const fieldConfig = entity.fields[req.body.key];

            if (typeof fieldConfig !== "string" && typeof fieldConfig === "object" && 'options' in fieldConfig) {
                //@ts-ignore
                editNavigationWidgetConfig = fieldConfig.options;
            }
        }
    } else {
        const fieldConfig = sails.config.adminpanel[`${entityType}s`].data[req.param("entityName")][req.body.key];

        if (typeof fieldConfig === "object" && 'options' in fieldConfig) {
            //@ts-ignore
            editNavigationWidgetConfig = fieldConfig.options;
        }
    }

    let normalizedConfig = await WidgetHelper.editNavigationConfigNormalize(editNavigationWidgetConfig);
    res.send(normalizedConfig);
    return
};
