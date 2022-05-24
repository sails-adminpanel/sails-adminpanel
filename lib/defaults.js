"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content = void 0;
/**
 * Default admin config
 */
const adminpanelConfig = {
    /**
     * Default url prefix for admin panel
     */
    routePrefix: '\/admin',
    /**
     * Default path to views
     *
     * @type {?string}
     */
    pathToViews: null,
    /**
     * Name of model identifier field
     */
    identifierField: 'id',
    /**
     * Policies
     */
    policies: null,
    /**
     * Base menu configuration
     */
    menu: {
        // Should admin panel brand be visible ?
        brand: true,
        // List of additional actions
        actions: []
    },
    /**
     * List of admin pages
     */
    instances: {
        users: {
            title: "Users",
            model: "userap",
            icon: "user",
            add: {
                controller: "../controllers/addUser"
            },
            edit: {
                controller: "../controllers/editUser"
            }
        }
    },
    /**
     * List of sections in head
     */
    sections: []
};
exports.content = {
    adminpanel: adminpanelConfig
};
