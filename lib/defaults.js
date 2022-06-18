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
     * Base navbar configuration
     */
    navbar: {
        // List of additional actions
        additionalLinks: []
    },
    brand: {
        link: null
    },
    /**
     * List of admin pages
     */
    instances: {
        usersap: {
            title: "Users AP",
            model: "userap",
            icon: "users",
            add: {
                controller: "../controllers/addUser"
            },
            edit: {
                controller: "../controllers/editUser"
            },
            list: {
                fields: {
                    createdAt: false,
                    updatedAt: false,
                    id: false,
                    email: false,
                    passwordHashed: false,
                    timezone: false,
                    locale: false,
                    isDeleted: false,
                    isActive: false,
                    groups: false
                }
            }
        },
        groupsap: {
            title: "Groups AP",
            model: "groupap",
            icon: "users-cog",
            add: {
                controller: "../controllers/addGroup"
            },
            edit: {
                controller: "../controllers/editGroup"
            }
        }
    },
    translation: {
        locales: ['en', 'ru'],
        path: `${process.cwd()}/config/locales/adminpanel`,
        defaultLocale: 'en'
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
console.log("Adminpanel configuration: ", adminpanelConfig);
