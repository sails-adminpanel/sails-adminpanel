import * as path from "path";

export class ViewsHelper {

    /**
     * Base path for all views.
     */
    private static BASE_VIEWS_PATH = path.join(__dirname, '../views/');


    /**
     * Generate path to views files for given view engine
     *
     * @param {string} engine - View engine name. E.g. 'jade', 'ejs'...
     * @returns {string}
     */
    public static getPathToEngine(engine) {
        return path.join(this.BASE_VIEWS_PATH, engine, '/')
    }

    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    public static getViewPath(view) {
        return path.resolve(sails.config.adminpanel.pathToViews, view);
    }

    /**
     *
     * @param {IncommingMessage} req
     * @param {string} type Types: adminError|adminSuccess
     */
    public static hasFlash(req, type) {
        return (req.session.flash && req.session.flash[type]);
    }

    /**
     * Get needed field value from dat provided.
     *
     * @param {string} key
     * @param {object} field
     * @param {Array} data
     */
    public static getFieldValue(key, field, data) {
        let value = data[key];
        if (typeof value === "object" && field.config.type == 'association') {
            value = value[field.config.identifierField];
        }

        if (Array.isArray(value) && field.config.type == 'association-many') {
            let result = [];
            value.forEach(function (val) {
                result.push(val[field.config.identifierField]);
            });
            return result;
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
    public static isOptionSelected(option, value) {
        if (Array.isArray(value)) {
            return value.includes(option);
        } else {
            return (option == value);
        }
    }

    /**
     * Get's field value for view screen
     *
     * @param {string|number|boolean|object|Array} value
     * @param {object} field
     */
    public static getAssociationValue(value, field) {
        if (!value) {
            return '-----------';
        }

        let displayField = field.config.displayField || 'id';
        if (Array.isArray(value)) {
            let result = '';
            value.forEach(function (val) {
                result += val[displayField] + '<br/>';
            });
            return result;
        }

        if (typeof value === "object") {
            return value[displayField];
        }

        return value;
    }
}
