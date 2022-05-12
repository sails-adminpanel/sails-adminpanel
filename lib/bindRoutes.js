"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../actions/dashboard");
const welcome_1 = require("../actions/welcome");
const listJson_1 = require("../actions/listJson");
const edit_1 = require("../actions/edit");
const add_1 = require("../actions/add");
const view_1 = require("../actions/view");
const remove_1 = require("../actions/remove");
const upload_1 = require("../actions/upload");
function bindRoutes() {
    let _bindPolicies = require('../lib/bindPolicies').default();
    /**
     * List or one policy that should be bound to actions
     * @type {string|Array}
     */
    let policies = sails.config.adminpanel.policies || '';
    //Create a base instance route
    let baseRoute = sails.config.adminpanel.routePrefix + '/:instance';
    /**
     * List of records
     */
    sails.router.bind(baseRoute + "/json", _bindPolicies(policies, listJson_1.default));
    /**
     * Create new record
     */
    sails.router.bind(baseRoute + '/add', _bindPolicies(policies, add_1.default));
    /**
     * View record details
     */
    sails.router.bind(baseRoute + '/view/:id', _bindPolicies(policies, view_1.default));
    /**
     * Edit existing record
     */
    sails.router.bind(baseRoute + '/edit/:id', _bindPolicies(policies, edit_1.default));
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
    if (Boolean(sails.config.adminpanel.dashboard)) {
        sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, dashboard_1.default));
    }
    else {
        sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, welcome_1.default));
    }
}
exports.default = bindRoutes;
;
