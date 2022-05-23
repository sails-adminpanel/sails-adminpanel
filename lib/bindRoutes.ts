import _dashboard from "../controllers/dashboard";
import _welcome from "../controllers/welcome";
import _list from "../controllers/list";
import _listJson from "../controllers/listJson";
import _edit from "../controllers/edit";
import _add from "../controllers/add";
import _view from "../controllers/view";
import _remove from "../controllers/remove";
import _upload from "../controllers/upload";

export default function bindRoutes() {

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
    sails.router.bind(baseRoute, _bindPolicies(policies, _list));

    for (let instance of Object.keys(config.instances)) {
        /**
         * Create new record
         */
        if (config.instances[instance].add && config.instances[instance].add.controller) {
            let controller = require(config.instances[instance].add.controller);
            sails.router.bind(`${config.routePrefix}/${instance}/add`, _bindPolicies(policies, controller));
        } else {
            sails.router.bind(`${config.routePrefix}/${instance}/add`, _bindPolicies(policies, _add));
        }

        /**
         * Edit existing record
         */
        if (config.instances[instance].edit && config.instances[instance].edit.controller) {
            let controller = require(config.instances[instance].edit.controller);
            sails.router.bind(`${config.routePrefix}/${instance}/edit`, _bindPolicies(policies, controller));
        } else {
            sails.router.bind(`${config.routePrefix}/${instance}/edit`, _bindPolicies(policies, _edit));
        }
    }

    /**
     * View record details
     */
    sails.router.bind(baseRoute + '/view/:id', _bindPolicies(policies, _view));
    sails.router.bind(baseRoute+"/json", _bindPolicies(policies, _listJson));

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

    if (Boolean(config.dashboard)) {
        sails.router.bind(config.routePrefix, _bindPolicies(policies, _dashboard));
    } else {
        sails.router.bind(config.routePrefix, _bindPolicies(policies, _welcome));
    }

};
