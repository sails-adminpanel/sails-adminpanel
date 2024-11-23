"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelper = void 0;
const Router_1 = require("../system/Router");
const defaults_1 = require("../system/defaults");
const adminUtil_1 = require("../lib/adminUtil");
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
        return adminizer.config;
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
        let config = adminizer.config;
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
    /**
     * Normalizes field configuration from various formats.
     *
     * @param config Field configuration in boolean, string, or object notation
     * @param key Field key name
     * @param modelField Field model configuration
     * @returns Normalized field configuration or `false` if the field should be hidden
     */
    static normalizeFieldConfig(config, key, modelField) {
        if (typeof config === "undefined" || typeof key === "undefined") {
            throw new Error('No `config` or `key` passed!');
        }
        // Boolean notation: `true` means field is visible; `false` means field is hidden.
        if (typeof config === "boolean") {
            return config ? { title: key } : false;
        }
        // String notation: Interpreted as the field title.
        if (typeof config === "string") {
            return { title: config };
        }
        // Object notation: Allows full customization of the field.
        if (typeof config === "object" && config !== null) {
            config.title = config.title || key;
            // For association types, determine display field by checking model attributes.
            if (["association", "association-many"].includes(config.type)) {
                let associatedModelAttributes = {};
                let displayField;
                try {
                    const associatedModel = config.type === "association"
                        ? modelField.model.toLowerCase()
                        : modelField.collection.toLowerCase();
                    associatedModelAttributes =
                        adminUtil_1.AdminUtil.getModel(associatedModel).attributes;
                }
                catch (e) {
                    console.error(`Error loading model for field ${key}:`, e);
                }
                displayField = getDisplayField(associatedModelAttributes);
                config = {
                    ...config,
                    identifierField: "id",
                    displayField: displayField,
                };
            }
            return config;
        }
        return false;
    }
}
exports.ConfigHelper = ConfigHelper;
/**
 * function to determine the display field for associations.
 * Checks if 'name' or 'label' exists in model attributes, defaults to 'id'.
 *
 * @param attributes Model attributes
 * @returns Field name to use as display field
 */
function getDisplayField(attributes) {
    return attributes.hasOwnProperty("name")
        ? "name"
        : attributes.hasOwnProperty("label")
            ? "label"
            : "id";
}
