import {Instance} from "../interfaces/types";
import {InstanceConfig} from "../interfaces/adminpanelConfig";
import ORMModel from "../interfaces/ORMModel";

export class AdminUtil {

    /**
     * Default configuration for instance
     *
     * @see AdminUtil.findConfig
     */
    private static _defaultInstanceConfig = {
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
    private static _defaultActionConfig = {
        fields: {}
    };

    /**
     * Check if given instance config has all required properties
     *
     * @param {Object} config
     * @returns {boolean}
     * @private
     */
    private static _isValidInstanceConfig(config) {
        return (typeof config === "object" && typeof config.model === "string");
    };

    /**
     * Normalizing instance config.
     * Will return fulfilled configuration object.
     *
     * @see AdminUtil._isValidInstanceConfig
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeInstanceConfig(config) {
        if (!this._isValidInstanceConfig(config)) {
            sails.log.error('Wrong instance configuration, using default');
            config = {};
        }
        config = Object.assign(this._defaultInstanceConfig, config);

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
    };

    /**
     * Normalize action config object
     *
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeActionConfig(config) {
        //Adding fields
        config.fields = config.fields || {};
        return Object.assign(this._defaultActionConfig, config);
    };

    /**
     * Get admin panel config
     *
     * @returns {Object}
     */
    public static config() {
        return sails.config.adminpanel || {};
    }

    /**
     * Get model from system
     *
     * @param {string} name
     * @returns {?Model}
     */
    public static getModel(name: string): ORMModel {
        //Getting model
        // console.log('admin > model > ', sails.models);
        let Model = sails.models[name.toLowerCase()];
        if (!Model) {
            if (!sails) {
                console.log('No model found in sails.');
            } else {
                sails.log.error('No model found in sails.');
            }
            return null;
        }
        return Model;
    }

    /**
     * Get instance name
     *
     * @param {Request} req
     * @returns {?string}
     */
    public static findInstanceName(req): string {
      if (!req.param('instance')) {
          let instanceName = req.originalUrl.split('/')[2];
          if (!this.config().instances || !this.config().instances[instanceName]) {
              return null;
          } else {
              return instanceName
          }
      }
      return req.param('instance');
    };

    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @param {String} instanceName
     * @returns {?Object}
     */
    public static findInstanceConfig(req, instanceName): InstanceConfig {
        if (!this.config().instances || !this.config().instances[instanceName]) {
            req._sails.log.error('No such route exists');
            return null;
        }
        return this._normalizeInstanceConfig(this.config().instances[instanceName] || {});
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
     * @param {Object} instance Instance object with `name`, `config`, `model` {@link AdminUtil.findInstanceObject}
     * @param {string} actionType Type of action that config should be loaded for. Example: list, edit, add, remove, view.
     * @returns {Object} Will return object with configs or default configs.
     */
    public static findActionConfig(instance, actionType) {
        if (!instance || !actionType) {
            throw new Error('No `instance` or `actionType` passed !');
        }
        let result = Object.assign({}, this._defaultActionConfig);
        if (!instance.config || !instance.config[actionType]) {
            return result;
        }
        /**
         * Here we could get true/false so need to update it to Object for later manipulations
         * In this function
         */
        if (typeof instance.config[actionType] === "boolean") {
            return result;
        }
        return this._normalizeActionConfig(instance.config[actionType]);
    }

    /**
     * Trying to find model by request
     *
     * @see AdminUtil._isValidInstanceConfig
     * @param {Request} req
     * @param {Object} instanceConfig
     * @returns {?Model}
     */
    public static findModel(req, instanceConfig): ORMModel {
        if (!this._isValidInstanceConfig(instanceConfig)) {
            return null;
        }
        return this.getModel(instanceConfig.model);
    }

    /**
     * Will create instance object from request.
     *
     * Instance Object will have this format:
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
    public static findInstanceObject(req): Instance {
        let instanceName = this.findInstanceName(req);
        let instanceConfig = this.findInstanceConfig(req, instanceName);
        let instanceModel = this.findModel(req, instanceConfig);
        let instanceUri = this.config().routePrefix + '/' + instanceName;
        return {
            name: instanceName,
            config: instanceConfig,
            model: instanceModel,
            uri: instanceUri
        };
    }
}
