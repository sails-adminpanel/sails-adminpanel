"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsHelper = void 0;
const adminUtil_1 = require("../lib/adminUtil");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
class FieldsHelper {
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
    static _normalizeFieldConfig(config, key, modelField) {
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
                        let model = adminUtil_1.AdminUtil.getModel(modelField.model.toLowerCase());
                        associatedModelAttributes = adminUtil_1.AdminUtil.getModel(modelField.model.toLowerCase()).attributes;
                    }
                    catch (e) {
                        adminizer.log.error(e);
                    }
                }
                else if (config.type === 'association-many') {
                    try {
                        // console.log('admin > helper > collection > ', AdminUtil.getModel(modelField.collection.toLowerCase()).attributes);
                        associatedModelAttributes = adminUtil_1.AdminUtil.getModel(modelField.collection.toLowerCase()).attributes;
                    }
                    catch (e) {
                        adminizer.log.error(e);
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
    static async loadAssociations(fields, user, action) {
        /**
         * Load all associated records for given field key
         *
         * @param {string} key
         * @param {function=} [cb]
         */
        let loadAssoc = async function (key, user, action) {
            let fieldConfigConfig = fields[key].config;
            if (fieldConfigConfig.type !== 'association' && fieldConfigConfig.type !== 'association-many') {
                return;
            }
            fieldConfigConfig.records = [];
            let modelName = fields[key].model.model || fields[key].model.collection;
            if (!modelName) {
                adminizer.log.error('No model found for field: ', fields[key]);
                return;
            }
            let Model = adminUtil_1.AdminUtil.getModel(modelName);
            if (!Model) {
                return;
            }
            let list;
            try {
                // adding deprecated records array to config for association widget
                adminizer.log.warn("Warning: executing malicious job trying to add a huge amount of records in field config," +
                    " please rewrite this part of code in the nearest future");
                let entity = { name: modelName, config: adminizer.config.models[modelName],
                    model: Model, uri: `/admin/model/${modelName}`, type: "model" };
                let dataAccessor = new DataAccessor_1.DataAccessor(user, entity, action);
                list = await Model._find({}, dataAccessor);
            }
            catch (e) {
                adminizer.log.error(e);
                throw new Error("FieldsHelper > loadAssociations error");
            }
            fieldConfigConfig.records = list;
        };
        for await (let key of Object.keys(fields)) {
            try {
                await loadAssoc(key, user, action);
            }
            catch (e) {
                adminizer.log.error(e);
                return e;
            }
        }
        return fields;
    }
    /**
     * Create list of populated models
     *
     * @param {Object} fields
     * @returns {Array}
     */
    static getFieldsToPopulate(fields) {
        let result = [];
        Object.entries(fields).forEach(function ([key, field]) {
            if (field.config.type === 'association' || field.config.type === 'association-many') {
                result.push(key);
            }
        });
        return result;
    }
}
exports.FieldsHelper = FieldsHelper;
