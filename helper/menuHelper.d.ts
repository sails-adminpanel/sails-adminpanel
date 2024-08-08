/**
 * Menu helper
 *
 * @constructor
 */
import { ActionType, AdminpanelConfig, HrefConfig, ModelConfig } from "../interfaces/adminpanelConfig";
export type MenuItem = {
    link: string;
    title: string;
    id: string;
    actions: HrefConfig[];
    icon: string;
    accessRightsToken: string;
    entityName?: string;
};
export declare class MenuHelper {
    private static config;
    constructor(config: AdminpanelConfig);
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
     * @param {Object} modelConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasGlobalActions(modelConfig: ModelConfig, action: ActionType): boolean;
    /**
     * Check if inline actions buttons added to action
     *
     * @param {Object} modelConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasInlineActions(modelConfig: ModelConfig, action: ActionType): boolean;
    /**
     * Get list of custom global buttons for action
     *
     * @param {Object} modelConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getGlobalActions(modelConfig: ModelConfig, action: ActionType): HrefConfig[];
    /**
     * Get list of custom inline buttons for action
     *
     * @param {Object} modelConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getInlineActions(modelConfig: ModelConfig, action: ActionType): HrefConfig[];
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
    static replaceModelFields(url: string, model: {
        [x: string]: string;
    }): string;
    /**
     * Get list of entity menus that was not bound to groups
     *
     * @returns {Array}
     */
    getMenuItems(): MenuItem[];
}
