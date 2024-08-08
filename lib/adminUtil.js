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
    static _normalizeModelConfig(entityName, config) {
        if (typeof config === "boolean") {
            config = {
                model: entityName,
                icon: 'file',
                title: entityName
            };
        }
        if (!this._isValidModelConfig(config)) {
            sails.log.error('Wrong entity configuration, using default');
            config = {
                model: entityName,
                icon: 'file',
                title: entityName
            };
        }
        config = { ...this._defaultModelConfig, ...config };
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
        return sails.config.adminpanel;
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
                sails.log.error('No model found in sails.');
            }
            else {
                sails.log.error('No model found in sails.');
            }
            return null;
        }
        return Model;
    }
    /**
     * Get entity type
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityType(req) {
        if (!req.param('entityType')) {
            let entityType = req.originalUrl.split('/')[2];
            if (!["form", "model", "wizard"].includes(entityType)) {
                return null;
            }
            else {
                return entityType;
            }
        }
        return req.param('entityType');
    }
    ;
    /**
     * Get entity name
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityName(req) {
        if (!req.param('entityName')) {
            let entityType = req.originalUrl.split('/')[2];
            let entityName = req.originalUrl.split('/')[3];
            if (entityType === "form" && (!this.config().forms || !this.config().forms.data || !this.config().forms.data[entityName])) {
                return null;
            }
            else if (entityType === "model" && (!this.config().models || !this.config().models[entityName])) {
                return null;
            }
            else {
                return entityName;
            }
        }
        return req.param('entityName');
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
            sails.log.error('No such route exists');
            return null;
        }
        return this._normalizeModelConfig(entityName, this.config().models[entityName]);
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
     * @param {Object} modelConfig
     * @returns {?Model}
     */
    static findModel(req, modelConfig) {
        if (!this._isValidModelConfig(modelConfig)) {
            return null;
        }
        const modelName = modelConfig.model;
        return this.getModel(modelName);
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
        // Retrieve entity name and type based on the request
        const entityName = this.findEntityName(req);
        const entityType = this.findEntityType(req);
        // Construct the entity URI
        const entityUri = `${this.config().routePrefix}/${entityType}/${entityName}`;
        // Initialize the Entity object
        const entity = {
            name: entityName,
            uri: entityUri,
            type: entityType
        };
        // If the entity type is "model", add additional properties
        if (entityType === "model") {
            // Find and add the model configuration to the entity
            entity.config = this.findModelConfig(req, entityName);
            // Find and add the model itself to the entity
            entity.model = this.findModel(req, entity.config);
        }
        // Return the completed entity object
        return entity;
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
