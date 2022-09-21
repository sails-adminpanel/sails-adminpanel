import * as path from "path";
import * as fs from "fs";

export class FormHelper {
    private static _forms = sails.config.adminpanel.forms ? sails.config.adminpanel.forms.data : null;

    public static async get(slug: string): Promise<object> {
        return this._forms[slug]
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

                    // Seeding forms data
                    for (let key in jsonData) {
                        if (!await sails.config.adminpanel.forms.get(form, key)){
                            console.log(await sails.config.adminpanel.forms.get(`${form}_${key}`))
                            await sails.config.adminpanel.forms.set(form, key, jsonData[key].value);
                        }
                    }
                } catch (error) {
                    sails.log.error(`Adminpanel > Error when reading ${formJson}: ${error}`);
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e)
        }
    }
}
