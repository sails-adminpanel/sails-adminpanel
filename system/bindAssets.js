"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const serveStatic = require("serve-static");
const path = require("path");
function default_1() {
    sails.hooks.http.app.use('/admin/assets', serveStatic(path.join(__dirname, '../assets')));
}
;
