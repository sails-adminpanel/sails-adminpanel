import _migrations from "../controllers/migrations";
import _processMigrations from "../controllers/processMigrations";
import _dashboard from "../controllers/dashboard";
import _welcome from "../controllers/welcome";
import _list from "../controllers/list";
import _listJson from "../controllers/listJson";
import _edit from "../controllers/edit";
import _add from "../controllers/add";
import _view from "../controllers/view";
import _remove from "../controllers/remove";
import _upload from "../controllers/upload";
import _uploadCKeditor5 from "../controllers/ckeditorUpload";
import _form from "../controllers/form";
import _normalizeNavigationConfig from "../controllers/normalizeNavigationConfig";
import {CreateUpdateConfig} from "../interfaces/adminpanelConfig";
import bindPolicies from "../lib/bindPolicies"
import {widgetSwitchController} from "../controllers/widgets/switch"

export default function bindRoutes() {

	/**
	 * List or one policy that should be bound to actions
	 * @type {string|Array}
	 */
	let config = sails.config.adminpanel;
	let policies = config.policies || "";

	/**
	 * Widgets Switch
	 */
	sails.router.bind(`${config.routePrefix}/widgets-get/:widgetId`, bindPolicies(policies, widgetSwitchController));


	/**
	 * Migrations
	 * */
	if (config.globalSettings.enableMigrations) {
		sails.router.bind(`${config.routePrefix}/migrations`, bindPolicies(policies, _migrations));
		sails.router.bind(`${config.routePrefix}/processMigrations`, bindPolicies(policies, _processMigrations));
	}

	/**
	 * Edit form
	 * */
	sails.router.bind(`${config.routePrefix}/form/:slug`, bindPolicies(policies, _form));
	// upload files to form
	sails.router.bind(`${config.routePrefix}/form/:slug/upload`, bindPolicies(policies, _upload));

	//Create a base entity route
	let baseRoute = config.routePrefix + "/:entityType/:entityName";

	/**
	 * Do widget helper functions (for now only one case handled)
	 * @todo for custom widgets api we will have to create universal controller that will call methods from any custom widgets
	 */
	sails.router.bind(baseRoute + "/widget", bindPolicies(policies, _normalizeNavigationConfig));

	/**
	 * List of records
	 */
	sails.router.bind(baseRoute, bindPolicies(policies, _list));

	if (config.models) {
		for (let model of Object.keys(config.models)) {
			/**
			 * Create new record
			 */
			if (config.models[model].add) {
				let addHandler = config.models[model].add as CreateUpdateConfig;
				if (addHandler.controller) {
					let controller = require(addHandler.controller);
					sails.router.bind(`${config.routePrefix}/model/${model}/add`, bindPolicies(policies, controller.default));
				} else {
					sails.router.bind(`${config.routePrefix}/model/${model}/add`, bindPolicies(policies, _add));
				}
			} else {
				sails.router.bind(`${config.routePrefix}/model/${model}/add`, bindPolicies(policies, _add));
			}
			/**
			 * Edit existing record
			 */
			if (config.models[model].edit) {
				let editHandler = config.models[model].edit as CreateUpdateConfig;
				if (editHandler.controller) {
					let controller = require(editHandler.controller);
					sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, controller.default));
				} else {
					sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, _edit));
				}
			} else {
				sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, _edit));
			}
		}
	}

	/**
	 * View record details
	 */
	sails.router.bind(baseRoute + "/view/:id", bindPolicies(policies, _view));
	sails.router.bind(baseRoute + "/json", bindPolicies(policies, _listJson));

	/**
	 * Remove record
	 */
	sails.router.bind(baseRoute + "/remove/:id", bindPolicies(policies, _remove));
	/**
	 * Upload files
	 */
	sails.router.bind(baseRoute + "/upload", bindPolicies(policies, _upload));
	/**
	 * Upload images CKeditor5
	 */
	sails.router.bind(`${baseRoute}/ckeditor5/upload`, bindPolicies(policies, _uploadCKeditor5));
	/**
	 * Create a default dashboard
	 * @todo define information that should be shown here
	 */
	if (Boolean(config.dashboard)) {
		sails.router.bind(config.routePrefix, bindPolicies(policies, _dashboard));
	} else {
		sails.router.bind(config.routePrefix, bindPolicies(policies, _welcome));
	}
}
