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
    if (!req.session.UserAP && sails.config.adminpanel.auth) {
        return res.redirect('/admin/userap/login');
    }
    return res.viewAdmin('welcome', { instance: "instance" });
}
exports.default = welcome;
;
