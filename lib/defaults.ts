'use strict'
import {AdminpanelConfig} from "../interfaces/adminpanelConfig";
import {FileStorageHelper} from "../helper/fileStorageHelper";
const packageJson = require('../package.json');
const timezones = require('./timezones.json');
/**
 * Default admin config
 */
const adminpanelConfig: AdminpanelConfig = {

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
            return FileStorageHelper.get(slug, key)
        },
        set: function (slug, key, value) {
            FileStorageHelper.set(slug, key, value)
        }
    },

    /**
     * List of sections in head
     */
    sections: [],
	widgets: null,
    package: packageJson,
    showVersion: true,
    timezones: timezones,
    migrations: {
        path: `${process.cwd()}/migrations`
    },
    globalSettings: {
        enableMigrations: false,
		enableWidgets: true
    }
}

export const content = {
    adminpanel: adminpanelConfig
};
