export declare class ViewsHelper {
    /**
     * Base path for all views.
     */
    static BASE_VIEWS_PATH: string;
    /**
     * Generate path to views files for given view engine
     *
     * @param {string} engine - View engine name. E.g. 'jade', 'ejs'...
     * @returns {string}
     */
    static getPathToEngine(engine: any): string;
    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    static getViewPath(view: any): string;
    /**
     *
     * @param {IncommingMessage} req
     * @param {string} type Types: adminError|adminSuccess
     */
    static hasFlash(req: any, type: any): any;
    /**
     * Get needed field value from dat provided.
     *
     * @param {string} key
     * @param {object} field
     * @param {Array} data
     */
    static getFieldValue(key: any, field: any, data: any): any;
    /**
     * Check if given option equals value or is in array
     *
     * @param {string|number} option
     * @param {string|number|Array} value
     * @returns {boolean}
     */
    static isOptionSelected(option: any, value: any): boolean;
    /**
     * Get's field value for view screen
     *
     * @param {string|number|boolean|object|Array} value
     * @param {object} field
     */
    static getAssociationValue(value: any, field: any): any;
}
