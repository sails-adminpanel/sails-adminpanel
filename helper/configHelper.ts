import { AdminpanelConfig } from "../interfaces/adminpanelConfig";

export class ConfigHelper {

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
        let entityConfig;
        Object.keys(config.entities).forEach((entityName) => {
            if (config.entities[entityName].model === modelName.toLowerCase()) {
                entityConfig = config.entities[entityName]
            }
        })

        if (entityConfig && entityConfig.identifierField) {
            return entityConfig.identifierField;
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
