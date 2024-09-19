"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormHelper = void 0;
const path = require("path");
const fs = require("fs");
class FormHelper {
    static get(slug) {
        if (sails.config.adminpanel.forms && sails.config.adminpanel.forms !== null) {
            return sails.config.adminpanel.forms.data[slug];
        }
        else {
            throw `Form with slug ${slug} not found`;
        }
    }
    static loadForms(formsPath) {
        try {
            let formsDirectoryPath = path.resolve(formsPath);
            let forms = fs.readdirSync(formsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });
            for (let formJson of forms) {
                if (path.extname(formJson).toLowerCase() !== ".json") {
                    continue;
                }
                let form = path.basename(formJson, '.json');
                try {
                    let jsonData = require(`${formsDirectoryPath}/${formJson}`);
                    sails.config.adminpanel.forms.data[form] = jsonData;
                }
                catch (error) {
                    sails.log.error(`Adminpanel > Error when reading ${formJson}: ${error}`);
                }
            }
        }
        catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e);
        }
    }
}
exports.FormHelper = FormHelper;
