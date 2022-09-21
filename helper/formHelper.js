"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormHelper = void 0;
const path = require("path");
const fs = require("fs");
class FormHelper {
    static async get(slug) {
        return this._forms[slug];
    }
    static async loadForms(formsPath) {
        try {
            let formsDirectoryPath = path.resolve(formsPath);
            let forms = fs.readdirSync(formsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });
            for (let form of forms) {
                try {
                    let jsonData = require(`${formsDirectoryPath}/${form}`);
                    sails.config.adminpanel.forms.data[path.basename(form, '.json')] = jsonData;
                    // Seeding forms data
                    for (let key in forms[form]) {
                        if (!await sails.config.adminpanel.forms.get(`${form}_${key}`)) {
                            await sails.config.adminpanel.forms.set(`${form}_${key}`, forms[form][key].value, form);
                        }
                    }
                }
                catch (error) {
                    sails.log.error(`Adminpanel > Error when reading ${form}.json: ${error}`);
                }
            }
        }
        catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e);
        }
    }
}
exports.FormHelper = FormHelper;
FormHelper._forms = sails.config.adminpanel.forms ? sails.config.adminpanel.forms.data : null;
