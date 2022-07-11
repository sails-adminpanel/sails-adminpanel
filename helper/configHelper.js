"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelper = void 0;
class ConfigHelper {
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
        let ModelConfig;
        Object.keys(config.models).forEach((entityName) => {
            if (config.models[entityName].model === modelName.toLowerCase()) {
                ModelConfig = config.models[entityName];
            }
        });
        if (ModelConfig && ModelConfig.identifierField) {
            return ModelConfig.identifierField;
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
