import { Entity, EntityType } from "../interfaces/types";
import { ActionType, AdminpanelConfig, CreateUpdateConfig, ModelConfig } from "../interfaces/adminpanelConfig";
import { AbstractModel } from "./v4/model/AbstractModel";
/**
 * @deprecated need refactor actions
 */
type ActionConfig = CreateUpdateConfig;
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
     * @deprecated use ModelHandler directly
     * @param {string} name
     * @returns {?Model}
     */
    static getModel(name: string): AbstractModel<any>;
    /**
     * Get entity type
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityType(req: ReqType): EntityType;
    /**
     * Get entity name
     *
     * @param {Request} req
     * @returns {?string}
     */
    static findEntityName(req: ReqType): string;
    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @param {String} entityName
     * @returns {?Object}
     */
    static findModelConfig(req: ReqType, entityName: string): ModelConfig;
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
    static findActionConfig(entity: Entity, actionType: ActionType): ActionConfig;
    /**
     * Trying to find model by request
     * @deprecated use ModelHandler directly
     * @see AdminUtil._isValidModelConfig
     * @param {Request} req
     * @param {Object} modelConfig
     * @returns {?Model}
     */
    static findModel<T extends keyof Models>(req: ReqType, modelConfig: ModelConfig): AbstractModel<any>;
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
    static findEntityObject(req: ReqType): Entity;
}
export {};
