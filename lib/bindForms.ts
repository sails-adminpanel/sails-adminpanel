import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default function bindForms() {
    if (fs.existsSync(sails.config.adminpanel.generator.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.generator.path);
        if (formsDir.length) {
            // load project translations
            FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.generator.path}`);
        }
    } else {
        sails.log.warn("Forms directory was not found, trying to create .tmp/forms...")
        try {
            fs.mkdirSync(`${process.cwd()}/${sails.config.adminpanel.generator.path}`);
        } catch (e) {
            sails.log.error("Adminpanel > Error when creating forms directory, you changes may not be saved", e)
        }
    }
}
