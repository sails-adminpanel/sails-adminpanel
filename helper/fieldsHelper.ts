import {ActionType, BaseFieldConfig, FieldsTypes, ModelConfig} from "../interfaces/adminpanelConfig";
import { Entity } from "../interfaces/types";
import { AdminUtil } from "../lib/adminUtil";
import {Attribute, ModelAnyInstance} from "../lib/v4/model/AbstractModel";
import {DataAccessor} from "../lib/v4/DataAccessor";
import {UserAPRecord} from "../models/UserAP";

export type Field = {
    config: BaseFieldConfig & {
        /** @deprecated record should not be in config anymore */
        records?: object[]
        file?: string
        key?: string
        required?: boolean
        type?: FieldsTypes
        groupsAccessRights?: string[]
    } | string | boolean
    /** for populated fields' configs */
    populated: {
        [key: string]: Field
    } | undefined
    model: Attribute
}

export type Fields = {
    [key: string]: Field;
};


type KeyIsAbsentInConfig = {
    /**
     * @deprecated key is lost
     */
    key: string
}

export class FieldsHelper {
    /**
     * Will normalize a field configuration that will be loaded from config file.
     *
     * Input parameters should be different.
     *
     * For now AdminPanel hook supports such notations into field configurations:
     *
     * + Boolean notation
     *
     * ```
     *  fieldName: true // will enable field showing/editing
     *  fieldName: false // will remove field from showing. Could be useful for actions like edit
     * ```
     *
     * + String notation
     *
     * ```
     *  fieldName: "Field title"
     * ```
     *
     * + Object notation
     *
     * ```
     *  fieldName: {
     *      title: "Field title", // You can overwrite field title
     *      type: "string", //you can overwrite default field type in admin panel
     *      required: true, // you can mark field required or not
     *      editor: true, // you can add WYSTYG editor for the field in admin panel
     *  }
     * ```
     *
     * There are several places for field config definition and an inheritance of field configs.
     *
     * 1. You could use a global `fields` property into `config/adminpanel.js` file into `entities` section.
     * 2. You could use `fields` property into `models:action` configuration. This config will overwrite global one
     *
     * ```
     *  module.exports.adminpanel = {
     *      models: {
     *          users: {
     *              title: 'Users', //Menu title for entity
     *              model: 'User', // Model definition for entity
     *
     *              fields: {
     *                  email: 'User Email', //it will define title for this field in all actions (list/add/edit/view)
     *                  createdAt: false, // Will hide createdAt field in all actions
     *                  bio: {
     *                      title: 'User bio',
     *                      editor: true
     *                  } // will set title `User bio` for the field and add editor into add/edit actions
     *              },
     *              // Action level config
     *              list: {
     *                  bio: false // will hide bio field into list view
     *              },
     *
     *              edit: {
     *                  createdAt: 'Created at' //will enable field `createdAt` and set title to `Created at`
     *              }
     *          }
     *      }
     *  }
     * ```
     *
     * @example
     *
     *  //default field config should look like:
     *  var fieldConfig = {
     *      key: 'fieldKeyFromModel'
     *      title: "Field title",
     *      type: "string", //Or any other type. Will be fetched from model if not defined in config
     *      // ... Other config will be added here
     *  };
     *
     * @throws {Error} if no config or key passed
     * @param {*} config
     * @param {string} key
     * @param modelField
     * @returns {boolean|Object}
     * @private
     */
    private static _normalizeFieldConfig(config: string | boolean | BaseFieldConfig , key: string, modelField: Attribute): false | BaseFieldConfig {
        if (typeof config === "undefined" || typeof key === "undefined") {
            throw new Error('No `config` or `key` passed !');
        }
        /**
         * check for boolean notation
         */
        if (typeof config === "boolean") {
            if (!config) {
                return false;
            }
            else {
                return {
                    // key: key,
                    title: key
                };
            }
        }
        // check for string notation
        if (typeof config === "string") {
            return {
                // key: key,
                title: config
            };
        }
        //check for object notation
        if (typeof config === "object" && config !== null) {
            // make required checks
            // if (!config.key) {
            //     config.key = key;
            // }
            if (!config.title) {
                config.title = key;
            }
            //validate associations
            // console.log(modelField);
            if (config.type === 'association' || config.type === 'association-many') {
                let associatedModelAttributes = {};
                let displayField;
                if (config.type === 'association') {
                    try {
                        let model = AdminUtil.getModel(modelField.model.toLowerCase() as keyof Models);
                        associatedModelAttributes = AdminUtil.getModel(modelField.model.toLowerCase() as keyof Models).attributes;
                    }
                    catch (e) {
                        sails.log.error(e);
                    }
                }
                else if (config.type === 'association-many') {
                    try {
                        // console.log('admin > helper > collection > ', AdminUtil.getModel(modelField.collection.toLowerCase()).attributes);
                        associatedModelAttributes = AdminUtil.getModel(modelField.collection.toLowerCase()  as keyof Models).attributes;
                    }
                    catch (e) {
                        sails.log.error(e);
                    }
                }
                // console.log('admin > helper > model > ', associatedModelAttributes);
                if (associatedModelAttributes.hasOwnProperty('name')) {
                    displayField = 'name';
                }
                else if (associatedModelAttributes.hasOwnProperty('label')) {
                    displayField = 'label';
                }
                else {
                    displayField = 'id';
                }
                config = Object.assign(config, {
                    identifierField: 'id',
                    displayField: displayField
                });
            }
            return config;
        }
        return false;
    }
    /**
     * Load list of records for all associations into `fields`
     *
     * @param {Object} fields
     * @param {function=} [cb]
     * @deprecated use DataModel class
     */
    public static async loadAssociations(fields: Fields, user?: UserAPRecord, action?: ActionType): Promise<Fields>{
        /**
         * Load all associated records for given field key
         *
         * @param {string} key
         * @param {function=} [cb]
         */
        let loadAssoc = async function (key: string, user?: UserAPRecord, action?: ActionType) {
            let fieldConfigConfig = fields[key].config as BaseFieldConfig & {records?: object[]};
            if (fieldConfigConfig.type !== 'association' && fieldConfigConfig.type !== 'association-many') {
                return;
            }
            fieldConfigConfig.records = [];

            let modelName = fields[key].model.model || fields[key].model.collection;

            if (!modelName) {
                sails.log.error('No model found for field: ', fields[key]);
                return;
            }

            let Model = AdminUtil.getModel(modelName as keyof Models);
            if (!Model) {
                return;
            }

            let list: ModelAnyInstance[];
            try {
                // adding deprecated records array to config for association widget
                sails.log.warn("Warning: executing malicious job trying to add a huge amount of records in field config," +
                  " please rewrite this part of code in the nearest future");
                let entity: Entity = {name: modelName, config: adminizer.config.models[modelName] as ModelConfig,
                    model: Model, uri: `/admin/model/${modelName}`, type: "model"};
                let dataAccessor = new DataAccessor(user, entity, action);
                list = await Model._find({}, dataAccessor);
            } catch (e) {
                sails.log.error(e)
                throw new Error("FieldsHelper > loadAssociations error");
            }

            fieldConfigConfig.records = list;
        };

        for await (let key of Object.keys(fields)) {
            try {
                await loadAssoc(key, user, action);
            } catch (e) {
                sails.log.error(e);
                return e;
            }
        }

        return fields
    }

    /**
     * Create list of populated models
     *
     * @param {Object} fields
     * @returns {Array}
     */
    public static getFieldsToPopulate(fields: Fields): string[] {
        let result: string[] = [];
        Object.entries<any>(fields).forEach(function ([key, field]) {
            if (field.config.type === 'association' || field.config.type === 'association-many') {
                result.push(key);
            }
        });

        return result;
    }
}
