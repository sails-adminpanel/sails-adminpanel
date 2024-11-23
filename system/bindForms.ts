import * as fs from "fs";
import {FormHelper} from "../helper/formHelper";

export default async function bindForms() {
    // and try to load from adminizer.config.forms.path
    if (fs.existsSync(adminizer.config.forms.path)) {
        let formsDir = fs.readdirSync(adminizer.config.forms.path);
        if (formsDir.length ) {
            FormHelper.loadForms(`${process.cwd()}/${adminizer.config.forms.path}`);
        }
    }

    sails.after(["hook:orm:loaded"], async () => {
        // Seeding forms data
        for (let form in adminizer.config.forms.data) {
            for (let key in adminizer.config.forms.data[form]) {
                if (await adminizer.config.forms.get(form, key) === undefined){
                    await adminizer.config.forms.set(form, key, adminizer.config.forms.data[form][key].value);
                }
            }
        }
    })

}
