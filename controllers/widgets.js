"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function widgets(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    return res.json({ widgets: sails.config.adminpanel.widgets });
}
exports.default = widgets;
