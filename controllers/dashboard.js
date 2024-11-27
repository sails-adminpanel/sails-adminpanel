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
    if (adminizer.config.auth && !req.session.UserAP) {
        return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }
    return res.viewAdmin('dashboard', { entity: "entity" });
}
;
