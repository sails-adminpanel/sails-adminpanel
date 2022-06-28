import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default function bindForms() {
    if (fs.existsSync(sails.config.adminpanel.generator.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.generator.path);
        if (formsDir.length) {
            // load project translations
            FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.generator.path}`);
        }
    }
}
