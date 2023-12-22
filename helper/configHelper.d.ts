import { AdminpanelConfig } from "../interfaces/adminpanelConfig";
export declare class ConfigHelper {
    static addModelConfig(modelConfig: any): void;
    static getConfig(): AdminpanelConfig;
    /**
     * Checks if given field is identifier of model
     *
     * @param {Object} field
     * @param {Object|string=} modelOrName
     * @returns {boolean}
     */
    static isId(field: any, modelOrName: any): boolean;
    /**
     * Get configured `identifierField` from adminpanel configuration.
     *
     * If not configured and model passed try to guess it using `primaryKey` field in model.
     * If system couldn't guess will return 'id`.
     * Model could be object or just name (string).
     *
     * **Warning** If you will pass record - method will return 'id'
     *
     * @returns {string}
     * @param modelName
     */
    static getIdentifierField(modelName: any): any;
    /**
     * Checks if CSRF protection enabled in website
     *
     * @returns {boolean}
     */
    static isCsrfEnabled(): boolean;
}
