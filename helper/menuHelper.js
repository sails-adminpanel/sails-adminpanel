"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuHelper = void 0;
let _ = require("lodash"); // заменить lodash реджексом
class MenuHelper {
    constructor(config) {
        MenuHelper.config = config;
    }
    /**
     * Checks if brand exists
     *
     * @returns {boolean}
     */
    static hasBrand() {
        return Boolean(this.config.brand && this.config.brand.link);
    }
    /**
     * Get menu brand link
     *
     * @returns {string}
     */
    static getBrandLink() {
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
    getBrandTitle() {
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
     * @param {Object} modelConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasGlobalActions(modelConfig, action) {
        action = action ?? 'list';
        const config = modelConfig[action];
        if (typeof config === "object" && config !== null && 'actions' in config) {
            if (!config.actions || !config.actions.global) {
                return false;
            }
            let actions = config.actions.global;
            return actions.length > 0;
        }
        else {
            return false;
        }
    }
    /**
     * Check if inline actions buttons added to action
     *
     * @param {Object} modelConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasInlineActions(modelConfig, action) {
        action = action ?? 'list';
        const config = modelConfig[action];
        if (typeof config !== "object" || config === null || !('actions' in config) || !config.actions.inline) {
            return false;
        }
        const actions = config.actions.inline;
        return actions.length > 0;
    }
    /**
     * Get list of custom global buttons for action
     *
     * @param {Object} modelConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getGlobalActions(modelConfig, action) {
        action = action ?? 'list';
        if (!this.hasGlobalActions(modelConfig, action)) {
            return [];
        }
        const config = modelConfig[action];
        if (typeof config === "object" && config !== null && 'actions' in config && config.actions.global) {
            return config.actions.global;
        }
        return [];
    }
    /**
     * Get list of custom inline buttons for action
     *
     * @param {Object} modelConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getInlineActions(modelConfig, action) {
        action = action || 'list';
        if (!this.hasInlineActions(modelConfig, action)) {
            return [];
        }
        const config = modelConfig[action];
        if (typeof config === "object" && config !== null && 'actions' in config && config.actions.inline) {
            return config.actions.inline;
        }
        return [];
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
    static replaceModelFields(url, model) {
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
        split.forEach(function (word) {
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
    getMenuItems() {
        let menus = [];
        if (MenuHelper.config.navbar.additionalLinks && MenuHelper.config.navbar.additionalLinks.length > 0) {
            MenuHelper.config.navbar.additionalLinks.forEach(function (additionalLink) {
                if (!additionalLink.link || !additionalLink.title || additionalLink.disabled) {
                    return;
                }
                menus.push({
                    link: additionalLink.link,
                    title: additionalLink.title,
                    id: additionalLink.id || additionalLink.title.replace(" ", "_"),
                    actions: additionalLink.subItems || null,
                    icon: additionalLink.icon || null,
                    accessRightsToken: additionalLink.accessRightsToken || null
                });
            });
        }
        if (MenuHelper.config.models) {
            Object.entries(MenuHelper.config.models).forEach(function ([key, val]) {
                if (!val.hide) {
                    if (val.tools && val.tools.length > 0 && val.tools[0].id !== "overview") {
                        val.tools.unshift({
                            id: "overview",
                            link: MenuHelper.config.routePrefix + '/model/' + key,
                            title: 'Overview',
                            icon: "list",
                            accessRightsToken: `read-${key}-model`
                        });
                    }
                    menus.push({
                        link: MenuHelper.config.routePrefix + '/model/' + key,
                        title: val.title || key,
                        icon: val.icon || null,
                        actions: val.tools || null,
                        id: val.title ? val.title.replace(" ", "_") : key,
                        entityName: key,
                        accessRightsToken: `read-${key}-model`
                    });
                }
            });
        }
        return menus;
    }
}
exports.MenuHelper = MenuHelper;
