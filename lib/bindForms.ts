import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default async function bindForms() {
    // and try to load from sails.config.adminpanel.forms.path
    if (fs.existsSync(sails.config.adminpanel.forms.path)) {
        let formsDir = fs.readdirSync(sails.config.adminpanel.forms.path);
        if (formsDir.length ) {
            FormHelper.loadForms(`${process.cwd()}/${sails.config.adminpanel.forms.path}`);
        }
    }

    // Seeding forms data
    for (let form in sails.config.adminpanel.forms.data) {
        for (let key in sails.config.adminpanel.forms.data[form]) {
            if (!await sails.config.adminpanel.forms.get(form, key)){
                await sails.config.adminpanel.forms.set(form, key, sails.config.adminpanel.forms.data[form][key].value);
            }
        }
    }
}
