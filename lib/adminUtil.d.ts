import { Entity } from "../interfaces/types";
import { AdminpanelConfig, ModelConfig } from "../interfaces/adminpanelConfig";
import ORMModel from "../interfaces/ORMModel";
export declare class AdminUtil {
    /**
     * Default configuration for entity
     *
     * @see AdminUtil.findConfig
     */
    private static _defaultModelConfig;
    /**
     * Default configs that will be returned for action. If nothing exists in config file.
     *
     * @see AdminUtil.findActionConfig
     */
    private static _defaultActionConfig;
    /**
     * Check if given entity config has all required properties
     *
     * @param {Object} config
     * @returns {boolean}
     * @private
     */
    private static _isValidModelConfig;
    /**
     * Normalizing entity config.
     * Will return fulfilled configuration object.
     *
     * @see AdminUtil._isValidModelConfig
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeModelConfig;
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
    static config(): AdminpanelConfig;
    /**
     * Get model from system
     *
     * @param {string} name
     * @returns {?Model}
     */
    static getModel(name: string): ORMModel;
    /**
     * Get entity type
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityType(req: any): string;
    /**
     * Get entity name
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityName(req: any): string;
    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @param {String} entityName
     * @returns {?Object}
     */
    static findModelConfig(req: any, entityName: any): ModelConfig;
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
    static findActionConfig(entity: any, actionType: any): any;
    /**
     * Trying to find model by request
     *
     * @see AdminUtil._isValidModelConfig
     * @param {Request} req
     * @param {Object} ModelConfig
     * @returns {?Model}
     */
    static findModel(req: any, ModelConfig: any): ORMModel;
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
    static findEntityObject(req: any): Entity;
}
