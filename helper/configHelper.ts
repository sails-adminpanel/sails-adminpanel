import { AdminpanelConfig } from "../interfaces/adminpanelConfig";
import Router from "../lib/Router";
import { getDefaultConfig, setDefaultConfig } from "../lib/defaults";
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
        return sails.config.adminpanel;
    }

    /**
     * Checks if given field is identifier of model
     *
     * @param {Object} field
     * @param {Object|string=} modelOrName
     * @returns {boolean}
     */
    public static isId(field, modelOrName): boolean {
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
    public static getIdentifierField(modelName) {

        if (!modelName) {
            throw new Error("Model name is not defined")
        }

        let config = sails.config.adminpanel;
        let ModelConfig;
        Object.keys(config.models).forEach((entityName) => {
            const model = config.models[entityName];
            if(typeof model !== "boolean") {
                if (model.model === modelName.toLowerCase()) {
                    ModelConfig = config.models[entityName]
                }
            }
        })

        if (ModelConfig && ModelConfig.identifierField) {
            return ModelConfig.identifierField;
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
}
