import {AdminpanelConfig, BaseFieldConfig, ModelConfig} from "../interfaces/adminpanelConfig";
import Router from "../system/Router";
import { getDefaultConfig, setDefaultConfig } from "../system/defaults";
import {AdminUtil} from "../lib/adminUtil";
import {Attribute} from "../lib/v4/model/AbstractModel";
export class ConfigHelper {

    public static addModelConfig(modelConfig: AdminpanelConfig["models"]): void {
        if(sails !== undefined && sails.config?.adminpanel !== undefined){
            const config = sails.config?.adminpanel
            const models = {...config.models}
            config.models = {...models, ...modelConfig}
        } else {
            const config = getDefaultConfig()
            const models = {...config.models}
            config.models = {...models, ...modelConfig}
            setDefaultConfig(config)
        }
        Router.bind()
    }

    public static getConfig(): AdminpanelConfig {
        return adminizer.config;
    }

    /**
     * Checks if given field is identifier of model
     *
     * @param {Object} field
     * @param {Object|string=} modelOrName
     * @returns {boolean}
     */
    public static isId(field: { config: { key: string; }; }, modelOrName: string): boolean {
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
    public static getIdentifierField(modelName: string) {

        if (!modelName) {
            throw new Error("Model name is not defined")
        }

        let config = adminizer.config;
        let modelConfig: ModelConfig;
        Object.keys(config.models).forEach((entityName) => {
            const model = config.models[entityName];
            if(typeof model !== "boolean") {
                if (model.model === modelName.toLowerCase()) {
                    if(typeof config.models[entityName] !== "boolean") {
                        modelConfig = config.models[entityName] as ModelConfig
                    }
                }
            }
        })

        if (modelConfig && modelConfig.identifierField) {
            return modelConfig.identifierField;
        } else if (sails.models[modelName.toLowerCase()].primaryKey) {
            return sails.models[modelName.toLowerCase()].primaryKey
        } else {
            throw new Error("ConfigHelper > Identifier field was not found")
        }
    }

    /**
     * Checks if CSRF protection enabled in website
     *
     * @returns {boolean}
     */
    public static isCsrfEnabled() {
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
    public static normalizeFieldConfig(
      config: string | boolean | BaseFieldConfig,
      key: string,
      modelField: Attribute
    ): false | BaseFieldConfig {
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
                let displayField: string;

                try {
                    const associatedModel =
                      config.type === "association"
                        ? modelField.model.toLowerCase()
                        : modelField.collection.toLowerCase();
                    associatedModelAttributes =
                      AdminUtil.getModel(associatedModel as keyof Models).attributes;
                } catch (e) {
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


/**
 * function to determine the display field for associations.
 * Checks if 'name' or 'label' exists in model attributes, defaults to 'id'.
 *
 * @param attributes Model attributes
 * @returns Field name to use as display field
 */
function getDisplayField(attributes: any): string {
    return attributes.hasOwnProperty("name")
      ? "name"
      : attributes.hasOwnProperty("label")
        ? "label"
        : "id";
}
