"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindTranslations;
const translationHelper_1 = require("../helper/translationHelper");
const fs = require("fs");
function bindTranslations() {
    // load adminpanel translations
    translationHelper_1.TranslationHelper.loadTranslations(`${adminizer.config.rootPath}/translations`);
    if (typeof adminizer.config.translation === 'boolean') {
        if (adminizer.config.translation === true) {
            adminizer.log.warn("adminizer.config.translation is TRUE, is not mater");
        }
        return;
    }
    if (fs.existsSync(adminizer.config.translation.path)) {
        let translationsDir = fs.readdirSync(adminizer.config.translation.path);
        if (translationsDir.length) {
            // load project translations
            translationHelper_1.TranslationHelper.loadTranslations(`${process.cwd()}/${adminizer.config.translation.path}`);
        }
    }
}
