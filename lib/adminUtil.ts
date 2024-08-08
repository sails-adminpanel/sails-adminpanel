import {Entity} from "../interfaces/types";
import {ActionType, AdminpanelConfig, CreateUpdateConfig, HrefConfig, ModelConfig} from "../interfaces/adminpanelConfig";
import { Attributes, ModelTypeDetection, Model } from "sails-typescript";

/**
 * @deprecated need refactor actions
 */
type ActionConfig = CreateUpdateConfig
export class AdminUtil {

    /**
     * Default configuration for entity
     *
     * @see AdminUtil.findConfig
     */
    private static _defaultModelConfig = {
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
     * Check if given entity config has all required properties
     *
     * @param {Object} config
     * @returns {boolean}
     * @private
     */
    private static _isValidModelConfig(config: ModelConfig) {
        return (typeof config === "object" && typeof config.model === "string");
    };

    /**
     * Normalizing entity config.
     * Will return fulfilled configuration object.
     *
     * @see AdminUtil._isValidModelConfig
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeModelConfig(entityName: string, config: ModelConfig | boolean) {
        if(typeof config === "boolean") {
            config = {
                model: entityName,
                icon: 'file',
                title: entityName
            }
        }

        if (!this._isValidModelConfig(config)) {
            sails.log.error('Wrong entity configuration, using default');
            config = {
                model: entityName,
                icon: 'file',
                title: entityName
            }
        }
        config = {...this._defaultModelConfig, ...config};
        return config;
    };

    /**
     * Normalize action config object
     *
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    private static _normalizeActionConfig(config: ActionConfig): ActionConfig {
        //Adding fields
        config.fields = config.fields || {};
        return {...this._defaultActionConfig, ...config};
    };

    /**
     * Get admin panel config
     *
     * @returns {Object}
     */
    public static config(): AdminpanelConfig {
        return sails.config.adminpanel;
    }

    /**
     * Get model from system
     *
     * @param {string} name
     * @returns {?Model}
     */
    public static getModel<T extends keyof Models>(name: T): Model<Models[T]> | null {
        //Getting model
        // console.log('admin > model > ', sails.models);
        let Model = sails.models[name.toLowerCase()];
        if (!Model) {
            if (!sails) {
                sails.log.error('No model found in sails.');
            } else {
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
    public static findEntityType(req: ReqType): string {
        if (!req.param('entityType')) {
            let entityType = req.originalUrl.split('/')[2];
            if (!["form", "model", "wizard"].includes(entityType)) {
                return null;
            } else {
                return entityType
            }
        }
        return req.param('entityType');
    };

    /**
     * Get entity name
     *
     * @param {Request} req
     * @returns {?string}
     */
    public static findEntityName(req: ReqType): string {
      if (!req.param('entityName')) {
          let entityType = req.originalUrl.split('/')[2];
          let entityName = req.originalUrl.split('/')[3];
          if (entityType === "form" && (!this.config().forms || !this.config().forms.data || !this.config().forms.data[entityName])) {
              return null
          } else if (entityType === "model" && (!this.config().models || !this.config().models[entityName])) {
              return null;
          } else {
              return entityName
          }
      }
      return req.param('entityName');
    };

    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @param {String} entityName
     * @returns {?Object}
     */
    public static findModelConfig(req: ReqType, entityName: string): ModelConfig {
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
    public static findActionConfig(entity: Entity, actionType: ActionType): ActionConfig {
        if (!entity || !actionType) {
            throw new Error('No `entity` or `actionType` passed !');
        }
        let result = {...this._defaultActionConfig};
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
    public static findModel(req: ReqType, ModelConfig: ModelConfig): StrippedORMModel {
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
    public static findEntityObject(req: ReqType): Entity {
        let entityName = this.findEntityName(req);
        let entityType = this.findEntityType(req);
        let entityUri = `${this.config().routePrefix}/${entityType}/${entityName}`;
        let entity: Entity = {
            name: entityName,
            uri: entityUri,
            type: entityType
        };
        if (entityType === "model") {
            entity.config = this.findModelConfig(req, entityName);
            // console.log(entityName, entity)

            entity.model = this.findModel(req, entity.config);
        }
        return entity;
    }
}
