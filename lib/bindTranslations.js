"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translationHelper_1 = require("../helper/translationHelper");
const fs = require("fs");
function bindTranslations() {
    // load adminpanel translations
    translationHelper_1.TranslationHelper.loadTranslations(`${sails.config.adminpanel.rootPath}/translations`);
    if (fs.existsSync(sails.config.adminpanel.translation.path)) {
        let translationsDir = fs.readdirSync(sails.config.adminpanel.translation.path);
        if (translationsDir.length) {
            // load project translations
            translationHelper_1.TranslationHelper.loadTranslations(`${process.cwd()}/${sails.config.adminpanel.translation.path}`);
        }
    }
}
exports.default = bindTranslations;
