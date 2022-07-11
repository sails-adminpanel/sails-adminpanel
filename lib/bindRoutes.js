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
function bindRoutes() {
    let _bindPolicies = require('../lib/bindPolicies').default();
    /**
     * List or one policy that should be bound to actions
     * @type {string|Array}
     */
    let config = sails.config.adminpanel;
    let policies = config.policies || '';
    /**
     * Edit form
     * */
    sails.router.bind(`${config.routePrefix}/form/:slug`, _bindPolicies(policies, form_1.default));
    // upload files to form
    sails.router.bind(`${config.routePrefix}/form/:slug/upload`, _bindPolicies(policies, upload_1.default));
    //Create a base entity route
    let baseRoute = config.routePrefix + '/:entityType/:entityName';
    /**
     * List of records
     */
    sails.router.bind(baseRoute, _bindPolicies(policies, list_1.default));
    if (config.models) {
        for (let model of Object.keys(config.models)) {
            /**
             * Create new record
             */
            if (config.models[model].add && config.models[model].add.controller) {
                let controller = require(config.models[model].add.controller);
                sails.router.bind(`${config.routePrefix}/model/${model}/add`, _bindPolicies(policies, controller.default));
            }
            else {
                sails.router.bind(`${config.routePrefix}/model/${model}/add`, _bindPolicies(policies, add_1.default));
            }
            /**
             * Edit existing record
             */
            if (config.models[model].edit && config.models[model].edit.controller) {
                let controller = require(config.models[model].edit.controller);
                sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, _bindPolicies(policies, controller.default));
            }
            else {
                sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, _bindPolicies(policies, edit_1.default));
            }
        }
    }
    /**
     * View record details
     */
    sails.router.bind(baseRoute + '/view/:id', _bindPolicies(policies, view_1.default));
    sails.router.bind(baseRoute + "/json", _bindPolicies(policies, listJson_1.default));
    /**
     * Remove record
     */
    sails.router.bind(baseRoute + '/remove/:id', _bindPolicies(policies, remove_1.default));
    /**
     * Upload files
     */
    sails.router.bind(baseRoute + '/upload', _bindPolicies(policies, upload_1.default));
    /**
     * Create a default dashboard
     * @todo define information that should be shown here
     */
    if (Boolean(config.dashboard)) {
        sails.router.bind(config.routePrefix, _bindPolicies(policies, dashboard_1.default));
    }
    else {
        sails.router.bind(config.routePrefix, _bindPolicies(policies, welcome_1.default));
    }
}
exports.default = bindRoutes;
;
