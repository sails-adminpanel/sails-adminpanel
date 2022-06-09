import {AdminpanelConfig} from "../interfaces/adminpanelConfig";
const packageJson = require('../package.json');
const timezones = require('./timezones.json')
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
    instances: {
        users: {
            title: "Users",
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
        groups: {
            title: "Groups",
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
}

export const content = {
    adminpanel: adminpanelConfig
};

console.log(adminpanelConfig)
