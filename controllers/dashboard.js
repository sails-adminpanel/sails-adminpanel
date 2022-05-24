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
    return res.viewAdmin('dashboard', { instance: "instance" });
}
exports.default = default_1;
;
