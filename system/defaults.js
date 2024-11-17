'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultConfig = setDefaultConfig;
exports.getDefaultConfig = getDefaultConfig;
exports.defaults = defaults;
const fileStorageHelper_1 = require("../helper/fileStorageHelper");
const packageJson = require('../package.json');
const timezones = require('../lib/timezones.json');
/**
 * Default admin config
 */
var adminpanelConfig = {
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
    models: {
        userap: {
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
        groupap: {
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
        path: `config/locales/adminpanel`,
        defaultLocale: 'en'
    },
    forms: {
        path: `api/adminpanel-forms`,
        data: {},
        get: async function (slug, key) {
            return fileStorageHelper_1.FileStorageHelper.get(slug, key);
        },
        set: async function (slug, key, value) {
            fileStorageHelper_1.FileStorageHelper.set(slug, key, value);
        }
    },
    /**
     * List of sections in head
     */
    sections: [],
    package: packageJson,
    showVersion: true,
    timezones: timezones,
    registration: {
        enable: false,
        defaultUserGroup: "guest",
        confirmationRequired: true
    }
};
function setDefaultConfig(config) {
    adminpanelConfig = config;
}
function getDefaultConfig() {
    return adminpanelConfig;
}
function defaults() {
    return {
        adminpanel: adminpanelConfig
    };
}
