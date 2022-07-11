"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
function default_1(req, res) {
    if (sails.config.adminpanel.auth && !req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
    }
    return res.viewAdmin('dashboard', { entity: "entity" });
}
exports.default = default_1;
;
