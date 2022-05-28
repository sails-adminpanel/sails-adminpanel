'use strict';

var _ = require('lodash');

module.exports = function(sails) {

    var config = sails.config.adminpanel;

    var ConfigHelper = {

        /**
         * Checks if given field is identifier of model
         *
         * @param {Object} field
         * @param {Object|string=} modelOrName
         * @returns {boolean}
         */
        getId: function(modelOrName) {
            return (field.config.key == this.getIdentifierField(modelOrName));
        },
        isId: function(field, modelOrName) {
            return (field.config.key == this.getIdentifierField(modelOrName));
        },

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
        getConfig: function() {
            return sails.config.adminpanel
        },
        getIdentifierField: function(modelName) {
            if (!modelName) {
                throw new Error("Model name is not defined");
            }
            let config = sails.config.adminpanel;
            let instanceConfig;
            Object.keys(config.instances).forEach((instanceName) => {
                if (config.instances[instanceName].model === modelName.toLowerCase()) {
                    instanceConfig = config.instances[instanceName];
                }
            });
            if (instanceConfig && instanceConfig.identifierField) {
                return instanceConfig.identifierField;
            }
            else if (sails.models[modelName.toLowerCase()].primaryKey) {
                return sails.models[modelName.toLowerCase()].primaryKey;
            }
            else {
                throw new Error("ConfigHelper > Identifier field was not found");
            }
        },

        /**
         * Checks if CSRF protection enabled in website
         *
         * @returns {boolean}
         */
        isCsrfEnabled: function() {
            return (sails.config.security.csrf !== false);
        }
    };

    return ConfigHelper;
};
