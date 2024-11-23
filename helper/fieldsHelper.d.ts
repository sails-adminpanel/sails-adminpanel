import { ActionType, BaseFieldConfig, FieldsTypes } from "../interfaces/adminpanelConfig";
import { Attribute } from "../lib/v4/model/AbstractModel";
import { UserAPRecord } from "../models/UserAP";
export type Field = {
    config: BaseFieldConfig & {
        /** @deprecated record should not be in config anymore */
        records?: object[];
        file?: string;
        key?: string;
        required?: boolean;
        type?: FieldsTypes;
    } | false;
    /** for populated fields' configs */
    populated: {
        [key: string]: Field;
    } | undefined;
    model: Attribute;
};
export type Fields = {
    [key: string]: Field;
};
export declare class FieldsHelper {
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
    private static _normalizeFieldConfig;
    /**
     * Load list of records for all associations into `fields`
     *
     * @param {Object} fields
     * @param {function=} [cb]
     * @deprecated use DataModel class
     */
    static loadAssociations(fields: Fields, user?: UserAPRecord, action?: ActionType): Promise<Fields>;
    /**
     * Create list of populated models
     *
     * @param {Object} fields
     * @returns {Array}
     */
    static getFieldsToPopulate(fields: Fields): string[];
}
