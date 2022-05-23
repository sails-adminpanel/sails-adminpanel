import {AdminpanelConfig} from "../interfaces/types";

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
     * Default policy that will be used to check access
     */
    policy: '',

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
}

export const content = {
    adminpanel: adminpanelConfig
};
