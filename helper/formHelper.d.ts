import { AdminpanelConfig } from "../interfaces/adminpanelConfig";
export declare class FormHelper {
    static get(slug: string): AdminpanelConfig["forms"]["data"][0];
    static loadForms(formsPath: string): void;
}
