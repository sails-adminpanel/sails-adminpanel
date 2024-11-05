import _processInstallStep from "../controllers/processInstallStep";
import _processInstallFinalize from "../controllers/processInstallFinalize";
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
import { CreateUpdateConfig } from "../interfaces/adminpanelConfig";
import bindPolicies from "./bindPolicies";
import { widgetSwitchController } from "../controllers/widgets/switch";
import { getAllWidgets } from "../lib/widgets/widgetHandler";
import { widgetsDB } from "../lib/widgets/widgetHandler";
import { widgetInfoController } from '../controllers/widgets/Info';
import { widgetActionController } from '../controllers/widgets/Action';
import { widgetCustomController } from "../controllers/widgets/Custom";
import { debounce } from "utils-decorators";
import { catalogController } from "../controllers/catalog/Catalog";
import { mediaManagerController } from "../controllers/media-manager/mediaManagerApi";
import { thumbController } from "../controllers/media-manager/ThumbController";


export default class Router {

	static onlyOnce: boolean = false;


	/**
	 * The idea is that all methods within the first 3 seconds after start call this method, and as soon as all have been loaded, the loading will be blocked
	 */
	@debounce(2000)
	static bind(): void {
		if (this.onlyOnce) {
			sails.log.error(`This method allowed for run only one time`);
			return;
		}

		/**
		 * List or one policy that should be bound to actions
		 * @type {string|Array}
		 */
		let config = sails.config.adminpanel;
		let policies = config.policies || "";

		/**
		 * Widgets All
		 */
		sails.router.bind(`${config.routePrefix}/widgets-get-all`, bindPolicies(policies, getAllWidgets));

		/**
		 * Widgets All from DB
		 */
		sails.router.bind(`${config.routePrefix}/widgets-get-all-db`, bindPolicies(policies, widgetsDB));


		/**
		 * Widgets Switch
		 */
		sails.router.bind(`${config.routePrefix}/widgets-switch/:widgetId`, bindPolicies(policies, widgetSwitchController));

		/**
		 * Widgets Info
		 */
		sails.router.bind(`${config.routePrefix}/widgets-info/:widgetId`, bindPolicies(policies, widgetInfoController))

		/**
		 * Widgets Action
		 */
		sails.router.bind(`${config.routePrefix}/widgets-action/:widgetId`, bindPolicies(policies, widgetActionController));

		/**
		 * Widgets Custom
		 */
		sails.router.bind(`${config.routePrefix}/widgets-action/:widgetId`, bindPolicies(policies, widgetCustomController));

		/**
		 * Module Install Stepper
		 * */
		sails.router.bind(`${config.routePrefix}/install/:id`, bindPolicies(policies, _processInstallStep));
		sails.router.bind(`${config.routePrefix}/install/:id/finalize`, bindPolicies(policies, _processInstallFinalize));

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
		 */
		sails.router.bind(baseRoute + "/widget", bindPolicies(policies, _normalizeNavigationConfig));

		/**
		 * Catalog
		 */
		sails.router.bind(`${config.routePrefix}/catalog/:slug/:id`, bindPolicies(policies, catalogController));
		sails.router.bind(`${config.routePrefix}/catalog/:slug`, bindPolicies(policies, catalogController));

		/**
		 * Media Manager
		 */
		sails.router.bind(`${config.routePrefix}/media-manager-uploader/:id`, bindPolicies(policies, mediaManagerController));
		sails.router.bind(`${config.routePrefix}/get-thumbs`, bindPolicies(policies, thumbController));

		/**
		 * List of records
		 */
		sails.router.bind(baseRoute, bindPolicies(policies, _list));

		if (config.models) {
			for (let model in config.models) {
				const modelConfig = config.models[model];
				/**
				 * Add support only routes created for boolean true
				 */
				if (typeof modelConfig === "boolean" && modelConfig === true) {
					sails.log.debug(`Adminpanel create CRUD routes for \`${model}\` by boolean true`)
					sails.router.bind(`${config.routePrefix}/model/${model}/add`, bindPolicies(policies, _add));
					sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, _edit));
					sails.router.bind(`${config.routePrefix}/model/${model}/remove/:id`, bindPolicies(policies, _remove));
				} else if (typeof modelConfig !== "boolean") {
					sails.log.debug(`Adminpanel create CRUD routes for \`${model}\` by ModelConfig`)

					/**
					 * Create new record
					 */
					if (modelConfig.add) {
						let addHandler = modelConfig.add as CreateUpdateConfig;
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
					if (modelConfig.edit) {
						let editHandler = modelConfig.edit as CreateUpdateConfig;
						if (editHandler.controller) {
							let controller = require(editHandler.controller);
							sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, controller.default));
						} else {
							sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, _edit));
						}
					} else {
						sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, bindPolicies(policies, _edit));
					}
				} else {
					sails.log.silly(`Adminpanel skip create CRUD routes for model: ${model}`)
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
		 */
		if (Boolean(config.dashboard)) {
			sails.router.bind(config.routePrefix, bindPolicies(policies, _dashboard));
		} else {
			sails.router.bind(config.routePrefix, bindPolicies(policies, _welcome));
		}
		sails.emit("adminpanel:router:binded");
	}
}
