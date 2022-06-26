import { AdminUtil } from "../lib/adminUtil";

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
     * 1. You could use a global `fields` property into `config/adminpanel.js` file into `instances` section.
     * 2. You could use `fields` property into `instances:action` configuration. This config will overwrite global one
     *
     * ```
     *  module.exports.adminpanel = {
     *      instances: {
     *          users: {
     *              title: 'Users', //Menu title for instance
     *              model: 'User', // Model definition for instance
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
    private static _normalizeFieldConfig(config, key, modelField) {
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
                    key: key,
                    title: key
                };
            }
        }
        // check for string notation
        if (typeof config === "string") {
            return {
                key: key,
                title: config
            };
        }
        //check for object notation
        if (typeof config === "object" && config !== null) {
            // make required checks
            if (!config.key) {
                config.key = key;
            }
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
                        associatedModelAttributes = AdminUtil.getModel(modelField.model.toLowerCase()).attributes;
                    }
                    catch (e) {
                        sails.log.error(e);
                    }
                }
                else if (config.type === 'association-many') {
                    try {
                        // console.log('admin > helper > collection > ', AdminUtil.getModel(modelField.collection.toLowerCase()).attributes);
                        associatedModelAttributes = AdminUtil.getModel(modelField.collection.toLowerCase()).attributes;
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
     */
    public static async loadAssociations(fields) {
        /**
         * Load all associated records for given field key
         *
         * @param {string} key
         * @param {function=} [cb]
         */
        let loadAssoc = async function(key) {
            if (fields[key].config.type !== 'association' && fields[key].config.type !== 'association-many') {
                return;
            }
            fields[key].config.records = [];

            let modelName = fields[key].model.model || fields[key].model.collection;
            if (!modelName) {
                sails.log.error('No model found for field: ', fields[key]);
                return;
            }

            let Model = AdminUtil.getModel(modelName);
            if (!Model) {
                return;
            }

            let list;
            try {
                list = await Model.find();
            } catch (e) {
                throw new Error("FieldsHelper > Models not found");
            }

            fields[key].config.records = list;
        };

        for await (let key of Object.keys(fields)) {
            try {
                await loadAssoc(key);
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
    public static getFieldsToPopulate(fields) {
        let result = [];
        Object.entries<any>(fields).forEach(function ([key, field]) {
            if (field.config.type === 'association' || field.config.type === 'association-many') {
                result.push(key);
            }
        });

        return result;
    }

    /**
     * Basically it will fetch all attributes without functions
     *
     * Result will be object with list of fields and its config.<br/>
     * <code>
     *  {
     *      "fieldName": {
     *          config: {
     *              key: 'fieldKeyFromModel'
     *              title: "Field title",
     *              type: "string", //Or any other type. Will be fetched from model if not defined in config
     *              // ... Other config will be added here
     *          },
     *          model: {
     *              // Here will be list of properties from your model
     *              type: 'string' //...
     *          }
     *      }
     *  }
     * </code>
     *
     * @param {Request} req Sails.js req object
     * @param {Object} instance Instance object with `name`, `config`, `model` {@link AdminUtil.findInstanceObject}
     * @param {string=} [type] Type of action that config should be loaded for. Example: list, edit, add, remove, view. Defaut: list
     * @returns {Object} Empty object or pbject with list of properties
     */
    public static getFields(req, instance, type) {
        if (!instance.model || !instance.model.attributes) {
            return {};
        }
        //get type of fields to show
        type = type || 'list';
        //get field config for actions
        let actionConfig = AdminUtil.findActionConfig(instance, type);
        let fieldsConfig = instance.config.fields || {};
        //Get keys from config
        //var actionConfigFields = _.keys(actionConfig.fields);
        //Getting list of fields from model
        let modelAttributes = instance.model.attributes


        let that = this;
        /**
         * Iteration function for every field
         *
         * @param {Object} modelField
         * @param {string} key
         * @private
         */
        let _prepareField = function ([key, modelField]) {
            /**
             * Checks for short type in waterline:
             * fieldName: 'string'
             */
            if (typeof modelField === "string") {
                modelField = {
                    type: modelField
                };
            }

            if (typeof modelField === "object" && modelField !== null && modelField.model) {
                modelField.type = 'association';
            }

            if (typeof modelField === "object" && modelField !== null && modelField.collection) {
                modelField.type = 'association-many';
            }

            if (type === 'add' && key === req._sails.config.adminpanel.identifierField) {
                return;
            }
            //Getting config form configuration file
            let fldConfig: any = { key: key, title: key };
            let ignoreField = false; // if set to true, field will be removed from editor/list
            //Checking global instance fields configuration
            if (fieldsConfig[key] || fieldsConfig[key] === false) {
                //if config set to false ignoring this field
                if (fieldsConfig[key] === false) {
                    ignoreField = true;
                }
                else {
                    let tmpCfg = that._normalizeFieldConfig(fieldsConfig[key], key, modelField);
                    fldConfig = {...fldConfig, ...tmpCfg};
                }
            }
            //Checking inaction instance fields configuration. Should overwrite global one
            if (actionConfig.fields[key] || actionConfig.fields[key] === false) {
                //if config set to false ignoring this field
                if (actionConfig.fields[key] === false) {
                    ignoreField = true;
                }
                else {
                    let tmpCfg = that._normalizeFieldConfig(actionConfig.fields[key], key, modelField);
                    ignoreField = false;
                    fldConfig = {...fldConfig, ...tmpCfg};
                }
            }
            if (ignoreField) {
                return;
            }
            //check required
            fldConfig.required = Boolean(fldConfig.required || modelField.required);
            /**
             * Default type for field.
             * Could be fetched form config file or file model if not defined in config file.
             */
            fldConfig.type = fldConfig.type || modelField.type;
            // All field types should be in lower case
            fldConfig.type = fldConfig.type.toLowerCase();
            //normalizing configs
            fldConfig = that._normalizeFieldConfig(fldConfig, key, modelField);
            //Adding new field to result set
            result[key] = {
                config: fldConfig,
                model: modelField
            };
        };
        // creating result
        let result = {};
        Object.entries(modelAttributes).forEach(_prepareField);

        return result;
    }
}