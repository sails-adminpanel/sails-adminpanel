import * as path from "path";
import * as fs from "fs";

export class FormHelper {

    public static async get(slug: string): Promise<object> {
        if (sails.config.adminpanel.forms && sails.config.adminpanel.forms !== null) {
            return sails.config.adminpanel.forms.data[slug]
        }
    }

    public static async loadForms(formsPath: string): Promise<void> {
        try {
            let formsDirectoryPath = path.resolve(formsPath);
            let forms = fs.readdirSync(formsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });

            for (let formJson of forms) {

                if (path.extname(formJson).toLowerCase() !== ".json"){
                    continue;
                }

                let form = path.basename(formJson, '.json')

                try {
                    let jsonData = require(`${formsDirectoryPath}/${formJson}`)
                    sails.config.adminpanel.forms.data[form] = jsonData;
                } catch (error) {
                    sails.log.error(`Adminpanel > Error when reading ${formJson}: ${error}`);
                }
            }

            // Seeding forms data
            for (let form in sails.config.adminpanel.forms.data) {
                for (let key in sails.config.adminpanel.forms.data[form]) {
                    if (!await sails.config.adminpanel.forms.get(form, key)){
                        await sails.config.adminpanel.forms.set(form, key, sails.config.adminpanel.forms.data[form][key]["value"]);
                    }
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e)
        }
    }
}
