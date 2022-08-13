/**
 * Menu helper
 *
 * @constructor
 */
import {ModelConfig} from "../interfaces/adminpanelConfig";

let _ = require("lodash") // заменить lodash реджексом
export class MenuHelper {

    private static config: any;

    constructor(config) {
        MenuHelper.config = config
    }

    /**
     * Checks if brand exists
     *
     * @returns {boolean}
     */
    public static hasBrand() {
        return Boolean(this.config.brand && this.config.brand.link);
    }

    /**
     * Get menu brand link
     *
     * @returns {string}
     */
    public static getBrandLink() {
        if (!this.config.brand || !this.config.brand.link || typeof this.config.brand.link !== "object" ||
            !this.config.brand.link.link) {
            return '/admin';
        }
        return this.config.brand.link.link;
    }

    /**
     * Get menu brand title
     *
     * @returns {string}
     */
    public getBrandTitle() {
        if (!MenuHelper.config.brand || !MenuHelper.config.brand.link) {
            return 'Sails-adminpanel';
        }
        if (typeof MenuHelper.config.brand.link === "string") {
            return MenuHelper.config.brand.link;
        }
        if (typeof MenuHelper.config.brand.link === "object" && typeof MenuHelper.config.brand.link.title === "string") {
            return MenuHelper.config.brand.link.title;
        }
        return 'Sails-adminpanel';
    }

    /**
     * Check if global actions buttons added to action
     *
     * @param {Object} ModelConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    public hasGlobalActions(ModelConfig, action) {
        action = action || 'list';
        if (!ModelConfig[action] || !ModelConfig[action].actions || !ModelConfig[action].actions.global) {
            return false;
        }

        let actions = ModelConfig[action].actions.global;
        return actions.length > 0;
    }

    /**
     * Check if inline actions buttons added to action
     *
     * @param {Object} ModelConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    public hasInlineActions(ModelConfig, action) {
        action = action || 'list';
        if (!ModelConfig[action] || !ModelConfig[action].actions || !ModelConfig[action].actions.inline) {
            return false;
        }
        let actions = ModelConfig[action].actions.inline;
        return actions.length > 0;

    }

    /**
     * Get list of custom global buttons for action
     *
     * @param {Object} ModelConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    public getGlobalActions(ModelConfig, action) {
        action = action || 'list';
        if (!this.hasGlobalActions(ModelConfig, action)) {
            return [];
        }
        return ModelConfig[action].actions.global;
    }

    /**
     * Get list of custom inline buttons for action
     *
     * @param {Object} ModelConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    public getInlineActions(ModelConfig, action) {
        action = action || 'list';
        if (!this.hasInlineActions(ModelConfig, action)) {
            return [];
        }
        return ModelConfig[action].actions.inline;
    }

    /**
     * Replace fields in given URL and binds to model fields.
     *
     * URL can contain different properties from given model in such notation `:propertyName`.
     * If model wouldn't have such property it will be left as `:varName`
     *
     * @param {string} url URL with list of variables to replace '/admin/test/:id/:title/'
     * @param {Object} model
     * @returns {string}
     */
    public static replaceModelFields(url, model) {
        let words = (str, pat) => {
            pat = pat || /\w+/g;
            str = str.toLowerCase();
            return str.match(pat);
        };
        // Check for model existence
        if (!model) {
            return url;
        }
        let split = words(url, /\:+[a-z\-_]*/gi);
        // Replacing props
        split.forEach(function(word) {
            let variable = word.replace(':', '');
            if (model && model[variable]) {
                url = url.replace(word, model[variable]);
            }
        });

        return url;
    }

    /**
     * Get list of entity menus that was not bound to groups
     *
     * @returns {Array}
     */
    public getMenuItems() {
        let menus = [];
        if (MenuHelper.config.navbar.additionalLinks && MenuHelper.config.navbar.additionalLinks.length > 0) {
            MenuHelper.config.navbar.additionalLinks.forEach(function(additionalLink) {
                if (!additionalLink.link || !additionalLink.title || additionalLink.disabled) {
                    return;
                }
                menus.push({
                    link: additionalLink.link,
                    title: additionalLink.title,
                    id: additionalLink.id || additionalLink.title.replace(" ","_"),
                    actions: additionalLink.subItems || null,
                    icon: additionalLink.icon || null
                });
            });
        }
        if (MenuHelper.config.models) {
            Object.entries<ModelConfig>(MenuHelper.config.models).forEach(function([key, val]) {
                if (!val.hide) {
                    if (val.tools && val.tools.length > 0 && val.tools[0].id !== "overview") {
                        val.tools.unshift({
                            id: "overview",
                            link: MenuHelper.config.routePrefix + '/model/' + key,
                            title: 'Overview',
                            icon: "list"
                        })
                    }
                    menus.push({
                        link: MenuHelper.config.routePrefix + '/model/' + key,
                        title: val.title || key,
                        icon: val.icon || null,
                        actions: val.tools || null,
                        id: val.title ? val.title.replace(" ","_") : key,
                        entityName: key
                    });
                }
            });
        }

        return menus;
    }
}
