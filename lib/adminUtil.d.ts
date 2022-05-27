import { Instance } from "../interfaces/types";
import { InstanceConfig } from "../interfaces/adminpanelConfig";
import ORMModel from "../interfaces/ORMModel";
export declare class AdminUtil {
    /**
     * Default configuration for instance
     *
     * @see AdminUtil.findConfig
     */
    private static _defaultInstanceConfig;
    /**
     * Default configs that will be returned for action. If nothing exists in config file.
     *
     * @see AdminUtil.findActionConfig
     */
    private static _defaultActionConfig;
    /**
     * Check if given instance config has all required properties
     *
     * @param {Object} config
     * @returns {boolean}
     * @private
     */
    private static _isValidInstanceConfig;
    /**
     * Normalizing instance config.
     * Will return fulfilled configuration object.
     *
     * @see AdminUtil._isValidInstanceConfig
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeInstanceConfig;
    /**
     * Normalize action config object
     *
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeActionConfig;
    /**
     * Get admin panel config
     *
     * @returns {Object}
     */
    static config(): any;
    /**
     * Get model from system
     *
     * @param {string} name
     * @returns {?Model}
     */
    static getModel(name: string): ORMModel;
    /**
     * Get instance name
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findInstanceName(req: any): string;
    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @param {String} instanceName
     * @returns {?Object}
     */
    static findInstanceConfig(req: any, instanceName: any): InstanceConfig;
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
    static findActionConfig(instance: any, actionType: any): any;
    /**
     * Trying to find model by request
     *
     * @see AdminUtil._isValidInstanceConfig
     * @param {Request} req
     * @param {Object} instanceConfig
     * @returns {?Model}
     */
    static findModel(req: any, instanceConfig: any): ORMModel;
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
    static findInstanceObject(req: any): Instance;
}
