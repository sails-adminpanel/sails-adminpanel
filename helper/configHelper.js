"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelper = void 0;
const Router_1 = require("../lib/Router");
const defaults_1 = require("../lib/defaults");
class ConfigHelper {
    static addModelConfig(modelConfig) {
        if (sails !== undefined && sails.config?.adminpanel !== undefined) {
            const config = sails.config?.adminpanel;
            const models = { ...config.models };
            config.models = { ...models, ...modelConfig };
        }
        else {
            const config = (0, defaults_1.getDefaultConfig)();
            const models = { ...config.models };
            config.models = { ...models, ...modelConfig };
            (0, defaults_1.setDefaultConfig)(config);
        }
        Router_1.default.bind();
    }
    static getConfig() {
        return sails.config.adminpanel;
    }
    /**
     * Checks if given field is identifier of model
     *
     * @param {Object} field
     * @param {Object|string=} modelOrName
     * @returns {boolean}
     */
    static isId(field, modelOrName) {
        return (field.config.key == this.getIdentifierField(modelOrName));
    }
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
    static getIdentifierField(modelName) {
        if (!modelName) {
            throw new Error("Model name is not defined");
        }
        let config = sails.config.adminpanel;
        let modelConfig;
        Object.keys(config.models).forEach((entityName) => {
            const model = config.models[entityName];
            if (typeof model !== "boolean") {
                if (model.model === modelName.toLowerCase()) {
                    if (typeof config.models[entityName] !== "boolean") {
                        modelConfig = config.models[entityName];
                    }
                }
            }
        });
        if (modelConfig && modelConfig.identifierField) {
            return modelConfig.identifierField;
        }
        else if (sails.models[modelName.toLowerCase()].primaryKey) {
            return sails.models[modelName.toLowerCase()].primaryKey;
        }
        else {
            throw new Error("ConfigHelper > Identifier field was not found");
        }
    }
    /**
     * Checks if CSRF protection enabled in website
     *
     * @returns {boolean}
     */
    static isCsrfEnabled() {
        return (sails.config.security.csrf !== false);
    }
}
exports.ConfigHelper = ConfigHelper;
