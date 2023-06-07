"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.widgetActionController = void 0;
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
const widgetHandler_1 = require("../../lib/widgets/widgetHandler");
async function widgetActionController(req, res) {
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
    if (widget === undefined) {
        return res.notFound();
    }
    /** Switch state  */
    else if (req.method.toUpperCase() === 'POST') {
        let state = await widget.action();
        if (state) {
            return res.json({ ok: state });
        }
        else {
            return res.serverError('Error');
        }
    }
}
exports.widgetActionController = widgetActionController;