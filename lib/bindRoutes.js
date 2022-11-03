"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../controllers/dashboard");
const welcome_1 = require("../controllers/welcome");
const list_1 = require("../controllers/list");
const listJson_1 = require("../controllers/listJson");
const edit_1 = require("../controllers/edit");
const add_1 = require("../controllers/add");
const view_1 = require("../controllers/view");
const remove_1 = require("../controllers/remove");
const upload_1 = require("../controllers/upload");
const form_1 = require("../controllers/form");
const normalizeNavigationConfig_1 = require("../controllers/normalizeNavigationConfig");
const bindPolicies_1 = require("../lib/bindPolicies");
function bindRoutes() {
    /**
     * List or one policy that should be bound to actions
     * @type {string|Array}
     */
    let config = sails.config.adminpanel;
    let policies = config.policies || "";
    /**
     * Edit form
     * */
    sails.router.bind(`${config.routePrefix}/form/:slug`, bindPolicies_1.default(policies, form_1.default));
    // upload files to form
    sails.router.bind(`${config.routePrefix}/form/:slug/upload`, bindPolicies_1.default(policies, upload_1.default));
    //Create a base entity route
    let baseRoute = config.routePrefix + "/:entityType/:entityName";
    /**
     * Do widget helper functions (for now only one case handled)
     * @todo for custom widgets api we will have to create universal controller that will call methods from any custom widgets
     */
    sails.router.bind(baseRoute + "/widget", bindPolicies_1.default(policies, normalizeNavigationConfig_1.default));
    /**
     * List of records
     */
    sails.router.bind(baseRoute, bindPolicies_1.default(policies, list_1.default));
    if (config.models) {
        for (let model of Object.keys(config.models)) {
            /**
             * Create new record
             */
            if (config.models[model].add) {
                let addHandler = config.models[model].add;
                if (addHandler.controller) {
                    let controller = require(addHandler.controller);
                    sails.router.bind(`${config.routePrefix}/model/${model}/add`, bindPolicies_1.default(policies, controller.default));
                }
            }
            else {
                sails.router.bind(`${config.routePrefix}/model/${model}/add`, bindPolicies_1.default(policies, add_1.default));
            }
            /**
             * Edit existing record
             */
            if (config.models[model].edit) {
                let editHandler = config.models[model].edit;
                if (editHandler.controller) {
                    let controller = require(editHandler.controller);
                    sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies_1.default(policies, controller.default));
                }
            }
            else {
                sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies_1.default(policies, edit_1.default));
            }
        }
    }
    /**
     * View record details
     */
    sails.router.bind(baseRoute + "/view/:id", bindPolicies_1.default(policies, view_1.default));
    sails.router.bind(baseRoute + "/json", bindPolicies_1.default(policies, listJson_1.default));
    /**
     * Remove record
     */
    sails.router.bind(baseRoute + "/remove/:id", bindPolicies_1.default(policies, remove_1.default));
    /**
     * Upload files
     */
    sails.router.bind(baseRoute + "/upload", bindPolicies_1.default(policies, upload_1.default));
    /**
     * Create a default dashboard
     * @todo define information that should be shown here
     */
    if (Boolean(config.dashboard)) {
        sails.router.bind(config.routePrefix, bindPolicies_1.default(policies, dashboard_1.default));
    }
    else {
        sails.router.bind(config.routePrefix, bindPolicies_1.default(policies, welcome_1.default));
    }
}
exports.default = bindRoutes;
