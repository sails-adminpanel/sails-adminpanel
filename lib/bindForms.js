"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const formHelper_1 = require("../helper/formHelper");
function bindForms() {
    if (fs.existsSync(sails.config.adminpanel.generator.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.generator.path);
        if (formsDir.length) {
            // load project translations
            formHelper_1.FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.generator.path}`);
        }
    }
}
exports.default = bindForms;
