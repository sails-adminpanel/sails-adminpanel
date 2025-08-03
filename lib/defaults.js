"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultConfig = setDefaultConfig;
exports.getDefaultConfig = getDefaultConfig;
exports.defaults = defaults;
const path = require('path');
const loadESM = require('./esmLoader.cjs');
let FileStorageHelper, timezones;
(async () => {
    try {
        const helperPath = {
            fileStorage: path.join('..', 'node_modules', 'adminizer', 'helpers', 'fileStorageHelper.js'),
            timezones: path.join('..', 'node_modules', 'adminizer', 'lib', 'timezones.js')
        };
        FileStorageHelper = await loadESM(helperPath.fileStorage, 'FileStorageHelper');
        timezones = await loadESM(helperPath.timezones, 'timezones');
    }
    catch (err) {
        console.error('Error init:', err);
        process.exit(1);
    }
})();
/**
 * Default admin config
 */
let adminpanelConfig = {
    /** Default route prefix */
    routePrefix: '/admin',
    /**
     * Name of model identifier field
     */
    identifierField: 'id',
    /**
     * Policies
     */
    policies: [],
    /**
     * Base navbar configuration
     */
    navbar: {
        // List of additional actions
        additionalLinks: []
    },
    brand: {
        link: ''
    },
    /**
     * List of admin pages
     */
    models: {
        UserAP: {
            title: "Users",
            model: "userap",
            icon: "people",
            navbar: {
                section: "System"
            },
            add: {
                controller: "../controllers/addUser"
            },
            edit: {
                controller: "../controllers/editUser"
            },
            fields: {
                login: {
                    title: 'User login',
                },
                fullName: {
                    title: 'Full Name'
                },
                password: {
                    title: 'Password',
                },
                isAdministrator: {
                    title: 'is administrator'
                },
                isConfirme: {
                    title: 'is confirme'
                }
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
        GroupAP: {
            title: "Groups",
            model: "groupap",
            icon: "group_add",
            navbar: {
                section: "System"
            },
            add: {
                controller: "../controllers/addGroup"
            },
            edit: {
                controller: "../controllers/editGroup"
            },
            list: {
                fields: {
                    createdAt: false,
                    updatedAt: false,
                    id: false,
                }
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
            return FileStorageHelper.get(slug, key);
        },
        set: async function (slug, key, value) {
            FileStorageHelper.set(slug, key, value);
        }
    },
    /**
     * List of sections in head
     */
    sections: [],
    package: { version: "4.0.0" },
    showVersion: true,
    timezones: timezones,
    styles: [],
    scripts: {
        header: [],
        footer: []
    },
    security: {
        csrf: true
    },
    registration: {
        enable: false,
        defaultUserGroup: "guest",
        confirmationRequired: true
    },
    auth: {
        enable: false,
        captcha: true
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
