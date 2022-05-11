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
     * @param {Object|string=} [model]
     * @returns {string}
     */
    static getIdentifierField(modelOrName) {
        let config = sails.config.adminpanel;
        let instanceConfig;
        Object.keys(config.instances);
        if (config.identifierField != 'id' || !modelOrName) {
            return config.identifierField;
        }
        let model;
        if (typeof modelOrName === "string") {
            model = sails.models[modelOrName.toLowerCase()];
        }
        else if (typeof modelOrName === "object" && typeof modelOrName.definition === "object") {
            model = modelOrName;
        }
        else {
            return config.identifierField;
        }
        if (!model.definition) {
            return config.identifierField;
        }
        let identifier;
        for (let [key, value] of Object.entries(model.definition)) {
            if (value.primaryKey) {
                identifier = key;
            }
        }
        return identifier || config.identifierField;
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
