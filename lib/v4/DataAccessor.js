"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccessor = void 0;
const adminUtil_1 = require("../adminUtil");
class DataAccessor {
    constructor(user, entity, type) {
        this.user = user;
        this.entity = entity;
        this.type = type;
    }
    // TODO add account access rights check
    // TODO hide if there is no access for relation model
    /**
     * Retrieves the fields for the given entity based on action type,
     * taking into account access rights and configuration settings.
     * @returns {Fields} An object with configured fields and their properties.
     */
    getFields() {
        if (!this.entity.model || !this.entity.model.attributes) {
            return {};
        }
        // get action and field configs
        const actionConfig = adminUtil_1.AdminUtil.findActionConfig(this.entity, this.type);
        const fieldsConfig = this.entity.config.fields || {};
        const modelAttributes = this.entity.model.attributes;
        const result = {};
        Object.entries(modelAttributes).forEach(([key, modelField]) => {
            // Checks for short type in Waterline: fieldName: 'string'
            if (typeof modelField === "string") {
                modelField = { type: modelField };
            }
            // Set association type for a field
            if (modelField && typeof modelField === "object") {
                if (modelField.model) {
                    modelField.type = "association";
                }
                if (modelField.collection) {
                    modelField.type = "association-many";
                }
            }
            // Ignore identifier field for add action
            if (this.type === "add" && key === sails.config.adminpanel.identifierField) {
                return;
            }
            // Getting base field config
            let fldConfig = { key: key, title: key };
            let ignoreField = false; // if set to true, field will be removed from editor/list
            // Check global entity fields configuration
            if (fieldsConfig[key] !== undefined) {
                // if config is set to false ignore this field
                if (fieldsConfig[key] === false) {
                    ignoreField = true;
                }
                else {
                    fldConfig = { ...fldConfig, ...DataAccessor._normalizeFieldConfig(fieldsConfig[key], key, modelField) };
                }
            }
            // Check access rights to a specific field
            // if (actionConfig.fields[key] !== undefined) {
            //   if (actionConfig.fields[key] === false) {
            //     ignoreField = true;
            //   } else {
            //     fldConfig = { ...fldConfig, ...FieldsHelper.normalizeFieldConfig(actionConfig.fields[key], key, modelField) };
            //   }
            // }
            if (ignoreField) {
                return;
            }
            // Set required flag and type
            fldConfig.required = Boolean(fldConfig.required || modelField.required);
            // Default type for field. Could be fetched form config file or file model if not defined in config file.
            fldConfig.type = fldConfig.type || modelField.type;
            // All field types should be in lower case
            fldConfig.type = fldConfig.type.toLowerCase();
            // Normalizing final config
            fldConfig = DataAccessor._normalizeFieldConfig(fldConfig, key, modelField);
            // Add new field to result set
            result[key] = { config: fldConfig, model: modelField };
        });
        return result;
    }
    // TODO associations should load taking into account another DataModel instance for keeping populated data safety
    // TODO remove poulateALL from Waterline adapetr
    async loadAssociations(fields) {
        return Promise.resolve(null);
    }
    /**
     * Normalizes field configuration from various formats.
     *
     * @param config Field configuration in boolean, string, or object notation
     * @param key Field key name
     * @param modelField Field model configuration
     * @returns Normalized field configuration or `false` if the field should be hidden
     */
    static _normalizeFieldConfig(config, key, modelField) {
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
                displayField = DataAccessor._getDisplayField(associatedModelAttributes);
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
    /**
     * Helper function to determine the display field for associations.
     * Checks if 'name' or 'label' exists in model attributes, defaults to 'id'.
     *
     * @param attributes Model attributes
     * @returns Field name to use as display field
     */
    static _getDisplayField(attributes) {
        return attributes.hasOwnProperty("name")
            ? "name"
            : attributes.hasOwnProperty("label")
                ? "label"
                : "id";
    }
}
exports.DataAccessor = DataAccessor;
