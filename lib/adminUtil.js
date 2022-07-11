"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUtil = void 0;
class AdminUtil {
    /**
     * Check if given entity config has all required properties
     *
     * @param {Object} config
     * @returns {boolean}
     * @private
     */
    static _isValidModelConfig(config) {
        return (typeof config === "object" && typeof config.model === "string");
    }
    ;
    /**
     * Normalizing entity config.
     * Will return fulfilled configuration object.
     *
     * @see AdminUtil._isValidModelConfig
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    static _normalizeModelConfig(config) {
        if (!this._isValidModelConfig(config)) {
            sails.log.error('Wrong entity configuration, using default');
            config = {};
        }
        config = { ...this._defaultModelConfig, ...config };
        //Check limits
        if (typeof config.list === "boolean") {
            config.list = {
                limit: 15
            };
        }
        if (typeof config.list.limit !== "number") {
            config.list.limit = 15;
        }
        return config;
    }
    ;
    /**
     * Normalize action config object
     *
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    static _normalizeActionConfig(config) {
        //Adding fields
        config.fields = config.fields || {};
        return { ...this._defaultActionConfig, ...config };
    }
    ;
    /**
     * Get admin panel config
     *
     * @returns {Object}
     */
    static config() {
        return sails.config.adminpanel || {};
    }
    /**
     * Get model from system
     *
     * @param {string} name
     * @returns {?Model}
     */
    static getModel(name) {
        //Getting model
        // console.log('admin > model > ', sails.models);
        let Model = sails.models[name.toLowerCase()];
        if (!Model) {
            if (!sails) {
                console.log('No model found in sails.');
            }
            else {
                sails.log.error('No model found in sails.');
            }
            return null;
        }
        return Model;
    }
    /**
     * Get entity name
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityName(req) {
        if (!req.param('entity')) {
            let entityName = req.originalUrl.split('/')[2];
            if (!this.config().models || !this.config().models[entityName]) {
                return null;
            }
            else {
                return entityName;
            }
        }
        return req.param('entity');
    }
    ;
    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @param {String} entityName
     * @returns {?Object}
     */
    static findModelConfig(req, entityName) {
        if (!this.config().models || !this.config().models[entityName]) {
            req._sails.log.error('No such route exists');
            return null;
        }
        return this._normalizeModelConfig(this.config().models[entityName] || {});
    }
    /**
     * Will get action config from configuration file depending to given action
     *
     * Config will consist of all configuration props from config file.
     *
     * @example
     *
     *  {
     *      'fields': {
     *          name: 'Name',
     *          email: true,
     *          anotherField: {
     *              title: 'Another field',
     *              //... some more options here
     *          }
     *      }
     *  }
     *
     * @throws {Error} if req or actionType not passed
     * @param {Object} entity Entity object with `name`, `config`, `model` {@link AdminUtil.findEntityObject}
     * @param {string} actionType Type of action that config should be loaded for. Example: list, edit, add, remove, view.
     * @returns {Object} Will return object with configs or default configs.
     */
    static findActionConfig(entity, actionType) {
        if (!entity || !actionType) {
            throw new Error('No `entity` or `actionType` passed !');
        }
        let result = { ...this._defaultActionConfig };
        if (!entity.config || !entity.config[actionType]) {
            return result;
        }
        /**
         * Here we could get true/false so need to update it to Object for later manipulations
         * In this function
         */
        if (typeof entity.config[actionType] === "boolean") {
            return result;
        }
        return this._normalizeActionConfig(entity.config[actionType]);
    }
    /**
     * Trying to find model by request
     *
     * @see AdminUtil._isValidModelConfig
     * @param {Request} req
     * @param {Object} ModelConfig
     * @returns {?Model}
     */
    static findModel(req, ModelConfig) {
        if (!this._isValidModelConfig(ModelConfig)) {
            return null;
        }
        return this.getModel(ModelConfig.model);
    }
    /**
     * Will create entity object from request.
     *
     * Entity Object will have this format:
     *
     * @example
     * ```javascript
     * {
     *  name: 'user',
     *  model: Model,
     *  config: { ... },
     *  uri: ''
     * }
     * ```
     *
     * @param req
     * @returns {Object}
     */
    static findEntityObject(req) {
        let entityName = this.findEntityName(req);
        let ModelConfig = this.findModelConfig(req, entityName);
        let entityModel = this.findModel(req, ModelConfig);
        let entityUri = this.config().routePrefix + '/' + entityName;
        return {
            name: entityName,
            config: ModelConfig,
            model: entityModel,
            uri: entityUri,
            type: "model"
        };
    }
}
exports.AdminUtil = AdminUtil;
/**
 * Default configuration for entity
 *
 * @see AdminUtil.findConfig
 */
AdminUtil._defaultModelConfig = {
    list: true,
    add: true,
    edit: true,
    remove: true,
    view: true
};
/**
 * Default configs that will be returned for action. If nothing exists in config file.
 *
 * @see AdminUtil.findActionConfig
 */
AdminUtil._defaultActionConfig = {
    fields: {}
};
