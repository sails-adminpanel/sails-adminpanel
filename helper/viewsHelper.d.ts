import { Field } from "./fieldsHelper";
import { ModelAnyField } from "../lib/v4/model/AbstractModel";
export declare class ViewsHelper {
    /**
     * Base path for all views.
     */
    static BASE_VIEWS_PATH: string;
    /**
     * Generate path to views files for given view engine
     * @deprecated only EJS support
     * @param {string} engine - View engine name. E.g. 'jade', 'ejs'...
     * @returns {string}
     */
    static getPathToEngine(engine: "ejs"): string;
    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    static getViewPath(view: string): string;
    /**
     *
     * @param {IncomingMessage} req
     * @param {string} key Types: adminError|adminSuccess
     */
    static hasMessages(req: ReqType, key: "adminError" | "adminSuccess"): string[];
    /**
     * Get needed field value from dat provided.
     *
     * @param {string} key
     * @param {object} field
     * @param {Array} data
     */
    static getFieldValue(key: string, field: Field, data: any): ModelAnyField;
    /**
     * Check if given option equals value or is in array
     *
     * @param {string|number} option
     * @param {string|number|Array} value
     * @returns {boolean}
     */
    static isOptionSelected(option: string | number | boolean, value: string | number | boolean | (string | number | boolean)[]): boolean;
    /**
     * Get's field value for view screen
     *
     * @param {string|number|boolean|object|Array} value
     * @param {object} field
     */
    static getAssociationValue(value: ModelAnyField, field: Field): string;
}
