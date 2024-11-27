"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = welcome;
/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
function welcome(req, res) {
    if (adminizer.config.auth && !req.session.UserAP) {
        return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }
    return res.viewAdmin('welcome', { entity: "entity" });
}
;
