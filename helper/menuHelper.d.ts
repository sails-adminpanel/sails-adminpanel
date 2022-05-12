export declare class MenuHelper {
    private static config;
    constructor(config: any);
    /**
     * Checks if brand exists
     *
     * @returns {boolean}
     */
    static hasBrand(): boolean;
    /**
     * Get menu brand link
     *
     * @returns {string}
     */
    static getBrandLink(): any;
    /**
     * Get menu brand title
     *
     * @returns {string}
     */
    getBrandTitle(): any;
    /**
     * Check if global actions buttons added to action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasGlobalActions(instanceConfig: any, action: any): boolean;
    /**
     * Check if inline actions buttons added to action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasInlineActions(instanceConfig: any, action: any): boolean;
    /**
     * Get list of custom global buttons for action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    static getGlobalActions(instanceConfig: any, action: any): void;
    /**
     * Get list of custom inline buttons for action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getInlineActions(instanceConfig: any, action: any): any;
    /**
     * Replace fields in given URL and binds to model fields.
     *
     * URL can contain different properties from given model in such notation `:propertyName`.
     * If model wouldn't have such property it will be left as `:varName`
     *
     * @param {string} url URL with list of variables to replace '/admin/test/:id/:title/'
     * @param {Object} model
     * @returns {string}
     */
    static replaceModelFields(url: any, model: any): void;
    /**
     * Will create a list of groups to show
     *
     * @returns {Array}
     */
    getGroups(): any;
    /**
     * Get list of instance menus that was not bound to groups
     *
     * @returns {Array}
     */
    getMenuItems(): any[];
}
