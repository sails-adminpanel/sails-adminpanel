import {TranslationHelper} from "../helper/translationHelper";
import * as fs from "fs";

export default function bindTranslations() {
    // load adminpanel translations
    TranslationHelper.loadTranslations(`${adminizer.config.rootPath}/translations`);

    if (typeof adminizer.config.translation  === 'boolean') {
        if(adminizer.config.translation as boolean === true) {
            sails.log.warn("adminizer.config.translation is TRUE, is not mater")
        }
        return
    }
    if (fs.existsSync(adminizer.config.translation.path)) {
        let translationsDir = fs.readdirSync(adminizer.config.translation.path);
        if (translationsDir.length) {
            // load project translations
            TranslationHelper.loadTranslations(`${process.cwd()}/${adminizer.config.translation.path}`);
        }
    }
}
