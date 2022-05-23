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
    if (!req.session.UserAP && sails.config.adminpanel.auth) {
        return res.redirect('/admin/userap/login');
    }
    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }
    return res.viewAdmin('dashboard', { instance: "instance" });
}
exports.default = default_1;
;
