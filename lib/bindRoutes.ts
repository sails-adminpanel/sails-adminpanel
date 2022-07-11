import _dashboard from "../controllers/dashboard";
import _welcome from "../controllers/welcome";
import _list from "../controllers/list";
import _listJson from "../controllers/listJson";
import _edit from "../controllers/edit";
import _add from "../controllers/add";
import _view from "../controllers/view";
import _remove from "../controllers/remove";
import _upload from "../controllers/upload";
import _form from "../controllers/form"

export default function bindRoutes() {

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
    sails.router.bind(`${config.routePrefix}/form/:slug`, _bindPolicies(policies, _form));
    // upload files to form
    sails.router.bind(`${config.routePrefix}/form/:slug/upload`, _bindPolicies(policies, _upload));

    //Create a base entity route
    let baseRoute = config.routePrefix + '/:entityType/:entityName';

    /**
     * List of records
     */
    sails.router.bind(baseRoute, _bindPolicies(policies, _list));

    if (config.models) {
        for (let model of Object.keys(config.models)) {
            /**
             * Create new record
             */
            if (config.models[model].add && config.models[model].add.controller) {
                let controller = require(config.models[model].add.controller);
                sails.router.bind(`${config.routePrefix}/model/${model}/add`, _bindPolicies(policies, controller.default));
            } else {
                sails.router.bind(`${config.routePrefix}/model/${model}/add`, _bindPolicies(policies, _add));
            }

            /**
             * Edit existing record
             */
            if (config.models[model].edit && config.models[model].edit.controller) {
                let controller = require(config.models[model].edit.controller);
                sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, _bindPolicies(policies, controller.default));
            } else {
                sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, _bindPolicies(policies, _edit));
            }
        }
    }

    /**
     * View record details
     */
    sails.router.bind(baseRoute + '/view/:id', _bindPolicies(policies, _view));
    sails.router.bind(baseRoute + "/json", _bindPolicies(policies, _listJson));

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
