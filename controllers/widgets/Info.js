"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.widgetInfoController = widgetInfoController;
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
const widgetHandler_1 = require("../../lib/widgets/widgetHandler");
async function widgetInfoController(req, res) {
    let widgetId = req.param('widgetId');
    if (!widgetId) {
        return res.notFound();
    }
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widgetId}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let widget = widgetHandler_1.WidgetHandler.getById(widgetId);
    if (widget === undefined) {
        return res.notFound();
    }
    /** get state */
    if (req.method.toUpperCase() === 'GET') {
        try {
            let text = await widget.getInfo();
            return res.send(text);
        }
        catch (e) {
            return res.serverError(e);
        }
    }
}
