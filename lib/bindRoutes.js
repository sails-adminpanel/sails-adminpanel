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
function bindRoutes() {
    let _bindPolicies = require('../lib/bindPolicies').default();
    /**
     * List or one policy that should be bound to actions
     * @type {string|Array}
     */
    let config = sails.config.adminpanel;
    let policies = config.policies || '';
    //Create a base instance route
    let baseRoute = config.routePrefix + '/:instance';
    /**
     * List of records
     */
    sails.router.bind(baseRoute, _bindPolicies(policies, list_1.default));
    for (let instance of Object.keys(config.instances)) {
        /**
         * Create new record
         */
        if (config.instances[instance].add && config.instances[instance].add.controller) {
            let controller = require(config.instances[instance].add.controller);
            sails.router.bind(`${config.routePrefix}/${instance}/add`, _bindPolicies(policies, controller.default));
        }
        else {
            sails.router.bind(`${config.routePrefix}/${instance}/add`, _bindPolicies(policies, add_1.default));
        }
        /**
         * Edit existing record
         */
        if (config.instances[instance].edit && config.instances[instance].edit.controller) {
            let controller = require(config.instances[instance].edit.controller);
            sails.router.bind(`${config.routePrefix}/${instance}/edit/:id`, _bindPolicies(policies, controller.default));
        }
        else {
            sails.router.bind(`${config.routePrefix}/${instance}/edit/:id`, _bindPolicies(policies, edit_1.default));
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
