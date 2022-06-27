import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default function bindForms() {
    if (sails.config.adminpanel.forms.loadFromFiles && fs.existsSync(sails.config.adminpanel.forms.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.forms.path);
        if (formsDir.length) {
            // load project translations
            FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.forms.path}`);
        }
    }
}
