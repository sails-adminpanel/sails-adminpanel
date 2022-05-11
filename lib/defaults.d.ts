export declare const content: {
    /**
     * Default admin config
     */
    adminpanel: {
        /**
         * Default url prefix for admin panel
         */
        routePrefix: string;
        /**
         * Will set method how assets will be placed into project
         */
        assets: string;
        /**
         * Default path to views
         *
         * @type {?string}
         */
        pathToViews: any;
        /**
         * Name of model identifier field
         */
        identifierField: string;
        /**
         * Default policy that will be used to check access
         */
        policy: string;
        /**
         * Base menu configuration
         */
        menu: {
            brand: boolean;
            groups: any[];
            actions: any[];
        };
        /**
         * List of admin pages
         */
        instances: {};
        /**
         * List of custom actions
         */
        actions: any[];
        /**
         * List of sections in head
         */
        sections: any[];
    };
};
