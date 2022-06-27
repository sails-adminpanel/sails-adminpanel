import * as path from "path";
import * as fs from "fs";

export class TranslationHelper {
    public static loadTranslations(translationsPath: string): void {
        let translationsConfig = sails.config.adminpanel.translation;
        if (!translationsConfig) {
            return
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
                    } catch (error) {
                        sails.log.error(`Adminpanel > Error when reading ${locale}.json: ${error}`);
                    }
                } else {
                    sails.log.error(`Adminpanel > Cannot find ${locale} locale in translations directory`)
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading translations", e)
        }
    }
}
