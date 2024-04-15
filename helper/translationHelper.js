"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationHelper = void 0;
const path = require("path");
const fs = require("fs");
let i18nFactory = require('i18n-2');
class TranslationHelper {
    static loadTranslations(translationsPath) {
        let translationsConfig = sails.config.adminpanel.translation;
        if (typeof translationsConfig === "boolean") {
            if (translationsConfig === true) {
                sails.log.warn("sails.config.adminpanel.translation is TRUE, is not mater");
            }
            return;
        }
        try {
            let translationsDirectoryPath = path.resolve(translationsPath);
            let translations = fs.readdirSync(translationsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });
            let localesList = translationsConfig.locales;
            let defaultLocale = translationsConfig.locales.includes(translationsConfig.defaultLocale) ?
                translationsConfig.defaultLocale : translationsConfig.locales[0];
            for (let locale of localesList) {
                if (translations.includes(`${locale}.json`)) {
                    try {
                        let jsonData = require(`${translationsDirectoryPath}/${locale}.json`);
                        sails.hooks.i18n.appendLocale(locale, jsonData);
                        // sails.hooks.i18n.defaultLocale = defaultLocale;
                    }
                    catch (error) {
                        sails.log.error(`Adminpanel > Error when reading ${locale}.json: ${error}`);
                    }
                }
                else {
                    sails.log.debug(`Adminpanel > Cannot find ${locale} locale in translations directory`);
                }
            }
        }
        catch (e) {
            sails.log.error("Adminpanel > Error when loading translations", e);
        }
    }
    static translateProperties(object, locale, fields) {
        const i18n = this.getI18nInstance(locale);
        const translateObject = (obj) => {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }
            Object.keys(obj).forEach((key) => {
                const value = obj[key];
                if (fields.includes(key) && typeof value !== 'object') {
                    obj[key] = i18n.__(value);
                }
                else {
                    obj[key] = translateObject(value);
                }
            });
            return obj;
        };
        return translateObject(object);
    }
    static getI18nInstance(locale) {
        const i18nConfig = {
            directory: typeof sails.config.adminpanel.translation !== "boolean" ? sails.config.adminpanel.translation.path : sails.config.i18n.localesDirectory,
            extension: ".json",
            defaultLocale: "en"
        };
        const i18n = new i18nFactory(i18nConfig);
        i18n.setLocale(locale);
        return i18n;
    }
}
exports.TranslationHelper = TranslationHelper;
