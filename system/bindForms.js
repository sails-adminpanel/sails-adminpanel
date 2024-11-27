"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindForms;
const fs = require("fs");
const formHelper_1 = require("../helper/formHelper");
async function bindForms() {
    // and try to load from adminizer.config.forms.path
    if (fs.existsSync(adminizer.config.forms.path)) {
        let formsDir = fs.readdirSync(adminizer.config.forms.path);
        if (formsDir.length) {
            formHelper_1.FormHelper.loadForms(`${process.cwd()}/${adminizer.config.forms.path}`);
        }
    }
    sails.after(["hook:orm:loaded"], async () => {
        // Seeding forms data
        for (let form in adminizer.config.forms.data) {
            for (let key in adminizer.config.forms.data[form]) {
                if (await adminizer.config.forms.get(form, key) === undefined) {
                    await adminizer.config.forms.set(form, key, adminizer.config.forms.data[form][key].value);
                }
            }
        }
    });
}
