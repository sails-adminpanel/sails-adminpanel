import * as path from "path";
import * as fs from "fs";
import { AdminpanelConfig } from "sails-adminpanel/interfaces/adminpanelConfig";

export class FormHelper {

    public static get(slug: string): AdminpanelConfig["forms"]["data"][0] {
        if (sails.config.adminpanel.forms && sails.config.adminpanel.forms !== null) {
            return sails.config.adminpanel.forms.data[slug]
        }
    }

    public static loadForms(formsPath: string): void {
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
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e)
        }
    }
}
