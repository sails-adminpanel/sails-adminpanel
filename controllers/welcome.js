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
    return res.viewAdmin('welcome', { instance: "instance" });
}
exports.default = welcome;
;
