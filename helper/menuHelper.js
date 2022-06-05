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
     * @param {Object} instanceConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasGlobalActions(instanceConfig, action) {
        action = action || 'list';
        if (!instanceConfig[action] || !instanceConfig[action].actions || !instanceConfig[action].actions.global) {
            return false;
        }
        let actions = instanceConfig[action].actions.global;
        return actions.length > 0;
    }
    /**
     * Check if inline actions buttons added to action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action] Defaults to `list`
     * @returns {boolean}
     */
    hasInlineActions(instanceConfig, action) {
        action = action || 'list';
        if (!instanceConfig[action] || !instanceConfig[action].actions || !instanceConfig[action].actions.inline) {
            return false;
        }
        let actions = instanceConfig[action].actions.inline;
        return actions.length > 0;
    }
    /**
     * Get list of custom global buttons for action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getGlobalActions(instanceConfig, action) {
        action = action || 'list';
        if (!this.hasGlobalActions(instanceConfig, action)) {
            return [];
        }
        return instanceConfig[action].actions.global;
    }
    /**
     * Get list of custom inline buttons for action
     *
     * @param {Object} instanceConfig
     * @param {string=} [action]
     * @returns {Array}
     */
    getInlineActions(instanceConfig, action) {
        action = action || 'list';
        if (!this.hasInlineActions(instanceConfig, action)) {
            return [];
        }
        return instanceConfig[action].actions.inline;
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
     * Get list of instance menus that was not bound to groups
     *
     * @returns {Array}
     */
    getMenuItems() {
        let menus = [];
        Object.entries(MenuHelper.config.instances).forEach(function ([key, val]) {
            if (val.tools && val.tools.length > 0 && val.tools[0].id !== "overview") {
                val.tools.unshift({
                    id: "overview",
                    link: MenuHelper.config.routePrefix + '/' + key,
                    title: 'Overview',
                    icon: ""
                });
            }
            menus.push({
                link: MenuHelper.config.routePrefix + '/' + key,
                title: val.title,
                icon: val.icon || null,
                actions: val.tools || null,
                id: val.title.replace(" ", "_"),
                instanceName: key
            });
        });
        if (MenuHelper.config.navbar.additionalLinks && MenuHelper.config.navbar.additionalLinks.length > 0) {
            MenuHelper.config.navbar.additionalLinks.forEach(function (additionalLink) {
                if (!additionalLink.link || !additionalLink.title || additionalLink.disabled) {
                    return;
                }
                menus.push({
                    link: additionalLink.link,
                    title: additionalLink.title,
                    id: additionalLink.id || additionalLink.title.replace(" ", "_"),
                    icon: additionalLink.icon || null
                });
            });
        }
        return menus;
    }
}
exports.MenuHelper = MenuHelper;
