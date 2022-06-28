import * as path from "path";
import * as fs from "fs";

export class FormHelper {
    private static _forms = sails.config.adminpanel.forms ? sails.config.adminpanel.forms.data : null;

    public static async update(slug: string, data: object): Promise<void> {
        if (this._forms[slug].setter) {
            this._forms[slug].setter(slug, data)
        }

        for (let field in data) {
            this._forms[slug][field].value = data[field]
        }

        if (sails.config.adminpanel.forms.loadFromFiles) {
            this.updateFormFile(`${process.cwd()}/${sails.config.adminpanel.forms.path}`, slug, this._forms[slug])
        }
    }

    public static get(slug: string): object {
        if (!this._forms) {
            return
        }

        if (this._forms[slug].getter) {
            return this._forms[slug].getter(slug)
        }

        let form = {};
        for (let field in this._forms[slug]) {
            form[field] = this._forms[slug][field];
            if (process.env[`${slug}_${field}`]) {
                form[field].value = process.env[`${slug}_${field}`];
            }
        }

        return form
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

    public static updateFormFile(formsPath: string, slug: string, data: object): void {
        try {
            let formsDirectoryPath = path.resolve(formsPath);
            let forms = fs.readdirSync(formsDirectoryPath).filter(function (file) {
                return path.extname(file).toLowerCase() === ".json";
            });

            for (let form of forms) {
                if (path.basename(form, '.json') === slug) {
                    try {
                        fs.writeFileSync(`${formsDirectoryPath}/${form}`, JSON.stringify(data))
                    } catch (error) {
                        sails.log.error(`Adminpanel > Error when updating ${form}: ${error}`);
                    }
                } else {
                    sails.log.error(`Adminpanel > Could not find ${form} to update`);
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading forms", e)
        }
    }
}
