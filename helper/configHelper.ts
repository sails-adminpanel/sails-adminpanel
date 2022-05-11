export class ConfigHelper {

    public static getConfig() {
        return sails.config.adminpanel
    }

    /**
     * Checks if given field is identifier of model
     *
     * @param {Object} field
     * @param {Object|string=} modelOrName
     * @returns {boolean}
     */
    public static isId(field, modelOrName) {
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
    public static getIdentifierField(modelOrName) {
        let config = sails.config.adminpanel;
        let instanceConfig;
        Object.keys(config.instances).forEach((instanceName) => {
            if (config.instances[instanceName].model === modelOrName) {
                instanceConfig = config.instances[instanceName]
            }
        })

        if (instanceConfig) {
            if (instanceConfig.identifierField !== "id" || !modelOrName) {
                return instanceConfig.identifierField;
            }
        }

        let model;
        if (typeof modelOrName === "string") {
            model = sails.models[modelOrName.toLowerCase()];
        } else if (typeof modelOrName === "object" && typeof modelOrName.definition === "object") {
            model = modelOrName;
        } else {
            return instanceConfig.identifierField;
        }

        if (!model.definition) {
            return sails.models[instanceConfig.model].primaryKey;
        }

        let identifier;
        for (let [key, value] of Object.entries<any>(model.definition)) {
            if (value.primaryKey) {
                identifier = key
            }
        }
        return identifier || instanceConfig.identifierField;
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
