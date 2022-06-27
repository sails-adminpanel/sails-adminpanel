"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const formHelper_1 = require("../helper/formHelper");
function bindForms() {
    if (sails.config.adminpanel.forms.loadFromFiles && fs.existsSync(sails.config.adminpanel.forms.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.forms.path);
        if (formsDir.length) {
            // load project translations
            formHelper_1.FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.forms.path}`);
        }
    }
}
exports.default = bindForms;
