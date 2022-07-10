import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default function bindForms() {
    if (fs.existsSync(`${process.cwd()}/.tmp/forms`)) {
        // if .tmp/forms exists - load from here
        let formsDir = fs.readdirSync(`${process.cwd()}/.tmp/forms`);
        if (formsDir.length) {
            FormHelper.loadForms(`${process.cwd()}/.tmp/forms`);
        }
    } else {
        // if not, create .tmp/forms
        try {
            fs.mkdirSync(`${process.cwd()}/.tmp/forms`);
        } catch (e) {
            sails.log.error("Adminpanel > Error when creating forms directory, you changes may not be saved", e)
        }

        // and try to load from sails.config.adminpanel.generator.path
        if (fs.existsSync(sails.config.adminpanel.generator.path)) {
            let formsDir = fs.readdirSync(sails.config.adminpanel.generator.path);
            if (formsDir.length) {
                FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.generator.path}`);
            }
        }
    }
}
