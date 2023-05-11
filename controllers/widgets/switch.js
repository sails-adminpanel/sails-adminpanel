"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.widgetSwitchController = void 0;
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
const widgetHandler_1 = require("../../lib/widgets/widgetHandler");
async function widgetSwitchController(req, res) {
    let widgetId = req.param('widgetId');
    if (!widgetId) {
        return res.notFound();
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widgetId}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let widget = widgetHandler_1.WidgetHandler.getById(widgetId);
    /** get state */
    if (req.method.toUpperCase() === 'GET') {
        return widget.getState();
    }
    /** Switch state  */
    else if (req.method.toUpperCase() === 'POST') {
        return widget.switchIt();
    }
}
exports.widgetSwitchController = widgetSwitchController;
