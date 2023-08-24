'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAdminpanelConfig = exports.getDefaultConfig = exports.setDefaultConfig = void 0;
const fileStorageHelper_1 = require("../helper/fileStorageHelper");
const packageJson = require('../package.json');
const timezones = require('./timezones.json');
const path = require("path");
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
        path: `config/locales/adminpanel`,
        defaultLocale: 'en'
    },
    forms: {
        path: `api/adminpanel-forms`,
        data: {},
        get: function (slug, key) {
            return fileStorageHelper_1.FileStorageHelper.get(slug, key);
        },
        set: function (slug, key, value) {
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
    migrations: {
        path: `${process.cwd()}/migrations`,
        config: path.resolve(__dirname + "./../database.json")
    },
    globalSettings: {
        enableMigrations: false
    }
};
function setDefaultConfig(config) {
    adminpanelConfig = config;
}
exports.setDefaultConfig = setDefaultConfig;
function getDefaultConfig() {
    return adminpanelConfig;
}
exports.getDefaultConfig = getDefaultConfig;
function defaultAdminpanelConfig() {
    return adminpanelConfig;
}
exports.defaultAdminpanelConfig = defaultAdminpanelConfig;
