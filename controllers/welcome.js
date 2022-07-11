"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
function welcome(req, res) {
    if (sails.config.adminpanel.auth && !req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
    }
    return res.viewAdmin('welcome', { entity: "entity" });
}
exports.default = welcome;
;
