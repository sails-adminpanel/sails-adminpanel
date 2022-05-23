"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res) {
    if (!req.session.UserAP && sails.config.adminpanel.auth) {
        return res.redirect('/admin/userap/login');
    }
    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }
    return res.viewAdmin("editGroup", { instance: "instance" });
}
exports.default = default_1;
;
