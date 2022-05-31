"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content = void 0;
const packageJson = require('../package.json');
const timezones = require('./timezones.json');
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
        },
        groups: {
            title: "Groups",
            model: "groupap",
            icon: "group",
            add: {
                controller: "../controllers/addGroup"
            },
            edit: {
                controller: "../controllers/editGroup"
            }
        }
    },
    /**
     * List of sections in head
     */
    sections: [],
    package: packageJson,
    showVersion: true,
    timezones: timezones
};
exports.content = {
    adminpanel: adminpanelConfig
};
console.log(adminpanelConfig);
