import _dashboard from "../actions/dashboard";
import _welcome from "../actions/welcome";
import _listJson from "../actions/listJson";
import _edit from "../actions/edit";
import _add from "../actions/add";
import _view from "../actions/view";
import _remove from "../actions/remove";
import _upload from "../actions/upload";

export default function bindRoutes() {

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
    sails.router.bind(baseRoute+"/json", _bindPolicies(policies, _listJson));
    /**
     * Create new record
     */
    sails.router.bind(baseRoute + '/add', _bindPolicies(policies, _add));
    /**
     * View record details
     */
    sails.router.bind(baseRoute + '/view/:id', _bindPolicies(policies, _view));
    /**
     * Edit existing record
     */
    sails.router.bind(baseRoute + '/edit/:id', _bindPolicies(policies, _edit));
    /**
     * Remove record
     */
    sails.router.bind(baseRoute + '/remove/:id', _bindPolicies(policies, _remove));
    /**
     * Upload files
     */
    sails.router.bind(baseRoute + '/upload', _bindPolicies(policies, _upload));
    /**
     * Create a default dashboard
     * @todo define information that should be shown here
     */

    if (Boolean(sails.config.adminpanel.dashboard)) {
        sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, _dashboard));
    } else {
        sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, _welcome));
    }

};
