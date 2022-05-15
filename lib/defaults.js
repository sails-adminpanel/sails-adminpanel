"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content = void 0;
exports.content = {
    /**
     * Default admin config
     */
    adminpanel: {
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
            // Menu groups
            groups: [],
            // List of additional actions
            actions: []
        },
        /**
         * List of admin pages
         */
        instances: {},
        /**
         * List of sections in head
         */
        sections: []
    }
};
