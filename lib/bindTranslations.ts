import {TranslationHelper} from "../helper/translationHelper";
import * as fs from "fs";

export default function bindTranslations() {
    // load adminpanel translations
    TranslationHelper.loadTranslations(`${sails.config.adminpanel.rootPath}/translations`);

    if (fs.existsSync(sails.config.adminpanel.translation.path)) {
        let translationsDir = fs.readdirSync(sails.config.adminpanel.translation.path);
        if (translationsDir.length) {
            // load project translations
            TranslationHelper.loadTranslations(`${process.cwd()}/${sails.config.adminpanel.translation.path}`);
        }
    }
}
