import * as path from "path";
import { Field } from "./fieldsHelper";
import { SailsModelAnyField, SailsModelAnyInstance } from "../interfaces/StrippedORMModel";

export class ViewsHelper {

    /**
     * Base path for all views.
     */
    public static BASE_VIEWS_PATH = path.join(__dirname, '../views/');


    /**
     * Generate path to views files for given view engine
     * @deprecated only EJS support
     * @param {string} engine - View engine name. E.g. 'jade', 'ejs'...
     * @returns {string}
     */
    public static getPathToEngine(engine: "ejs"): string {
        return path.join(this.BASE_VIEWS_PATH, engine, '/')
    }

    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    public static getViewPath(view: string): string {
        return path.resolve(sails.config.adminpanel.pathToViews, view);
    }

    /**
     *
     * @param {IncomingMessage} req
     * @param {string} key Types: adminError|adminSuccess
     */
    public static hasMessages(req: ReqType, key: "adminError" | "adminSuccess") {
        return (req.session.messages && req.session.messages[key]);
    }

    /**
     * Get needed field value from dat provided.
     *
     * @param {string} key
     * @param {object} field
     * @param {Array} data
     */
    public static getFieldValue(key: string, field: Field, data: SailsModelAnyInstance): SailsModelAnyField {
        let value = data[key];
    
        if (typeof value === "object" && value !== null) {
            if (field.config.type === 'association' && !Array.isArray(value)) {
                // Here we assert that value is an object and has the identifierField
                return value[field.config.identifierField as keyof typeof value] as SailsModelAnyField;
            }
    
            if (Array.isArray(value) && field.config.type === 'association-many') {
                return value.map(val => (val as any)[field.config.identifierField]) as SailsModelAnyField;
            }
        }
    
        return value as SailsModelAnyField;
    }
    

    /**
     * Check if given option equals value or is in array
     *
     * @param {string|number} option
     * @param {string|number|Array} value
     * @returns {boolean}
     */
    public static isOptionSelected(option: string | number | boolean, value: string | number | boolean | (string | number | boolean)[]): boolean {
        if (Array.isArray(value)) {
            return value.includes(option);
        } else {
            return (option == value);
        }
    }

    /**
     * Get's field value for view screen
     *
     * @param {string|number|boolean|object|Array} value
     * @param {object} field
     */
    public static getAssociationValue(value: SailsModelAnyField, field: Field): string {
        if (!value) {
            return '-----------';
        }
    
        const displayField = field.config.displayField || 'id';
    
        if (Array.isArray(value)) {
            return value
                .map(val => (val as unknown as { [key: string]: any })[displayField])
                .join('<br/>');
        }
    
        if (typeof value === 'object' && value !== null) {
            return (value as { [key: string]: any })[displayField];
        }
    
        return String(value);
    }
    
}
