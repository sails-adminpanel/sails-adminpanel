"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewsHelper = void 0;
const path = require("path");
class ViewsHelper {
    /**
     * Generate path to views files for given view engine
     * @deprecated only EJS support
     * @param {string} engine - View engine name. E.g. 'jade', 'ejs'...
     * @returns {string}
     */
    static getPathToEngine(engine) {
        return path.join(this.BASE_VIEWS_PATH, engine, '/');
    }
    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    static getViewPath(view) {
        return path.resolve(adminizer.config.pathToViews, view);
    }
    /**
     *
     * @param {IncomingMessage} req
     * @param {string} key Types: adminError|adminSuccess
     */
    static hasMessages(req, key) {
        return (req.session.messages && req.session.messages[key]);
    }
    /**
     * Get needed field value from dat provided.
     *
     * @param {string} key
     * @param {object} field
     * @param {Array} data
     */
    static getFieldValue(key, field, data) {
        let value = data[key];
        if (typeof value === "object" && value !== null) {
            let fieldConfigConfig = field.config;
            if (fieldConfigConfig.type === 'association' && !Array.isArray(value)) {
                // Here we assert that value is an object and has the identifierField
                return value[fieldConfigConfig.identifierField];
            }
            if (Array.isArray(value) && fieldConfigConfig.type === 'association-many') {
                return value.map(val => val[fieldConfigConfig.identifierField]);
            }
        }
        return value;
    }
    /**
     * Check if given option equals value or is in array
     *
     * @param {string|number} option
     * @param {string|number|Array} value
     * @returns {boolean}
     */
    static isOptionSelected(option, value) {
        if (Array.isArray(value)) {
            return value.includes(option);
        }
        else {
            return (option == value);
        }
    }
    /**
     * Get's field value for view screen
     *
     * @param {string|number|boolean|object|Array} value
     * @param {object} field
     */
    static getAssociationValue(value, field) {
        if (!value) {
            return '-----------';
        }
        let fieldConfigConfig = field.config;
        const displayField = fieldConfigConfig.displayField || 'id';
        if (Array.isArray(value)) {
            return value
                .map(val => val[displayField])
                .join('<br/>');
        }
        if (typeof value === 'object' && value !== null) {
            return value[displayField];
        }
        return String(value);
    }
}
exports.ViewsHelper = ViewsHelper;
/**
 * Base path for all views.
 */
ViewsHelper.BASE_VIEWS_PATH = path.join(__dirname, '../views/');
