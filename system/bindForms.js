"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindForms;
const fs = require("fs");
const formHelper_1 = require("../helper/formHelper");
async function bindForms() {
    // and try to load from sails.config.adminpanel.forms.path
    if (fs.existsSync(sails.config.adminpanel.forms.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.forms.path);
        if (formsDir.length) {
            formHelper_1.FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.forms.path}`);
        }
    }
    sails.after(["hook:orm:loaded"], async () => {
        // Seeding forms data
        for (let form in sails.config.adminpanel.forms.data) {
            for (let key in sails.config.adminpanel.forms.data[form]) {
                if (await sails.config.adminpanel.forms.get(form, key) === undefined) {
                    await sails.config.adminpanel.forms.set(form, key, sails.config.adminpanel.forms.data[form][key].value);
                }
            }
        }
    });
}