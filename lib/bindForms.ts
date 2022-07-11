import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default function bindForms() {
    // and try to load from sails.config.adminpanel.forms.path
    if (fs.existsSync(sails.config.adminpanel.forms.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.forms.path);
        if (formsDir.length) {
            FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.forms.path}`);
        }
    }
}
