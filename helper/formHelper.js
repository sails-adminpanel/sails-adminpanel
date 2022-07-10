"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormHelper = void 0;
const path = require("path");
const fs = require("fs");
class FormHelper {
    static async update(slug, data) {
        if (this._forms[slug].setter) {
            return this._forms[slug].setter(slug, data);
        }
        for (let field in data) {
            try {
                this._forms[slug][field].value = JSON.parse(data[field]);
            }
            catch (e) {
                this._forms[slug][field].value = data[field];
            }
        }
        this.updateFormFile(`${process.cwd()}/.tmp/forms`, slug, this._forms[slug]);
    }
    static get(slug) {
        if (!this._forms[slug]) {
            return;
        }
        if (this._forms[slug].getter) {
            return this._forms[slug].getter(slug);
        }
        let form = {};
        for (let field in this._forms[slug]) {
            form[field] = this._forms[slug][field];
            if (process.env[`${slug}_${field}`]) {
                form[field].value = process.env[`${slug}_${field}`];
            }
        }
        return form;
    }
    static loadForms(formsPath) {
        try {
            let formsDirectoryPath = path.resolve(formsPath);
            let forms = fs.readdirSync(formsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });
            for (let form of forms) {
                try {
                    let jsonData = require(`${formsDirectoryPath}/${form}`);
                    sails.config.adminpanel.generator.forms[path.basename(form, '.json')] = jsonData;
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
    static updateFormFile(formsPath, slug, data) {
        try {
            let formsDirectoryPath = path.resolve(formsPath);
            try {
                fs.writeFileSync(`${formsDirectoryPath}/${slug}.json`, JSON.stringify(data));
            }
            catch (error) {
                sails.log.error(`Adminpanel > Error when updating ${slug}.json: ${error}`);
            }
        }
        catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e);
        }
    }
}
exports.FormHelper = FormHelper;
FormHelper._forms = sails.config.adminpanel.generator ? sails.config.adminpanel.generator.forms : null;
