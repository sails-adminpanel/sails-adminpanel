"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
function default_1(req, res) {
    if (sails.config.adminpanel.auth && !req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    }
    return res.viewAdmin('dashboard', { entity: "entity" });
}
;
