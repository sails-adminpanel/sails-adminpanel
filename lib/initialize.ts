import * as fs from 'fs';
import { ViewsHelper } from "../helper/viewsHelper";
import * as path from "path";
import bindAssets from "./bindAssets"

export default function ToInitialize() {

    /**
     * List of hooks that required for adminpanel to work
     */
    let requiredHooks: string[] = [
        'blueprints',
        'controllers',
        'http',
        'orm',
        'policies',
        'views'
    ];

    return async function initialize(cb) {

        // If disabled. Do not load anything
        if (!sails.config.adminpanel) {
            return cb();
        }

        // Set up listener to bind shadow routes when the time is right.
        //
        // Always wait until after router has bound static routes.
        // If policies hook is enabled, also wait until policies are bound.
        // If orm hook is enabled, also wait until models are known.
        // If controllers hook is enabled, also wait until controllers are known.
        let eventsToWaitFor = [];
        eventsToWaitFor.push('router:after');

        try {
            /**
             * Check hooks availability
             */
            requiredHooks.forEach(function(hook) {
                // if (!sails.hooks[hook]) {
                //     throw new Error('Cannot use `adminpanel` hook without the `' + hook + '` hook.');
                // }
                // eventsToWaitFor.push('hook:' + hook + ':loaded');
            });
        } catch(err) {
            if (err) {
                return cb(err);
            }
        }

        //Check views engine and check if folder with templates exist
        if (!fs.existsSync(ViewsHelper.getPathToEngine(sails.config.views.extension))) {
            return cb(new Error('For now adminpanel hook could work only with Pug template engine.'));
        }

        require('./initializeAuthorization').default(cb);

        // sails.after(eventsToWaitFor, require('../lib/afterHooksLoaded')(sails));
        sails.on("lifted", require('../lib/afterHooksLoaded').default());

        sails.config.adminpanel.templateRootPath = ViewsHelper.BASE_VIEWS_PATH;
        sails.config.adminpanel.rootPath = path.resolve(__dirname + "/..")

        // Bind assets
        await bindAssets();
        cb();
    }
};
