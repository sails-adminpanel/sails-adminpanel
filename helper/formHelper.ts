import * as path from "path";
import * as fs from "fs";

export class FormHelper {
    private static _forms = sails.config.adminpanel.forms ? sails.config.adminpanel.forms.data : null;

    public static async get(slug: string): Promise<object> {
        return this._forms[slug]
    }

    public static loadForms(formsPath: string): void {

        try {
            let formsDirectoryPath = path.resolve(formsPath);
            let forms = fs.readdirSync(formsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });

            for (let form of forms) {
                try {
                    let jsonData = require(`${formsDirectoryPath}/${form}`)
                    sails.config.adminpanel.forms.data[path.basename(form, '.json')] = jsonData;
                } catch (error) {
                    sails.log.error(`Adminpanel > Error when reading ${form}.json: ${error}`);
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e)
        }
    }
}
