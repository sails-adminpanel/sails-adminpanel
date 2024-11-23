"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const processInstallStep_1 = require("../controllers/processInstallStep");
const processInstallFinalize_1 = require("../controllers/processInstallFinalize");
const dashboard_1 = require("../controllers/dashboard");
const welcome_1 = require("../controllers/welcome");
const list_1 = require("../controllers/list");
const listJson_1 = require("../controllers/listJson");
const edit_1 = require("../controllers/edit");
const add_1 = require("../controllers/add");
const view_1 = require("../controllers/view");
const remove_1 = require("../controllers/remove");
const upload_1 = require("../controllers/upload");
const ckeditorUpload_1 = require("../controllers/ckeditorUpload");
const form_1 = require("../controllers/form");
const normalizeNavigationConfig_1 = require("../controllers/normalizeNavigationConfig");
const bindPolicies_1 = require("./bindPolicies");
const switch_1 = require("../controllers/widgets/switch");
const widgetHandler_1 = require("../lib/widgets/widgetHandler");
const widgetHandler_2 = require("../lib/widgets/widgetHandler");
const Info_1 = require("../controllers/widgets/Info");
const Action_1 = require("../controllers/widgets/Action");
const Custom_1 = require("../controllers/widgets/Custom");
const utils_decorators_1 = require("utils-decorators");
const Catalog_1 = require("../controllers/catalog/Catalog");
const mediaManagerApi_1 = require("../controllers/media-manager/mediaManagerApi");
const ThumbController_1 = require("../controllers/media-manager/ThumbController");
class Router {
    /**
     * The idea is that all methods within the first 3 seconds after start call this method, and as soon as all have been loaded, the loading will be blocked
     */
    static bind() {
        if (this.onlyOnce) {
            adminizer.log.error(`This method allowed for run only one time`);
            return;
        }
        /**
         * List or one policy that should be bound to actions
         * @type {string|Array}
         */
        let config = adminizer.config;
        let policies = config.policies || "";
        /**
         * Widgets All
         */
        sails.router.bind(`${config.routePrefix}/widgets-get-all`, (0, bindPolicies_1.default)(policies, widgetHandler_1.getAllWidgets));
        /**
         * Widgets All from DB
         */
        sails.router.bind(`${config.routePrefix}/widgets-get-all-db`, (0, bindPolicies_1.default)(policies, widgetHandler_2.widgetsDB));
        /**
         * Widgets Switch
         */
        sails.router.bind(`${config.routePrefix}/widgets-switch/:widgetId`, (0, bindPolicies_1.default)(policies, switch_1.widgetSwitchController));
        /**
         * Widgets Info
         */
        sails.router.bind(`${config.routePrefix}/widgets-info/:widgetId`, (0, bindPolicies_1.default)(policies, Info_1.widgetInfoController));
        /**
         * Widgets Action
         */
        sails.router.bind(`${config.routePrefix}/widgets-action/:widgetId`, (0, bindPolicies_1.default)(policies, Action_1.widgetActionController));
        /**
         * Widgets Custom
         */
        sails.router.bind(`${config.routePrefix}/widgets-action/:widgetId`, (0, bindPolicies_1.default)(policies, Custom_1.widgetCustomController));
        /**
         * Module Install Stepper
         * */
        sails.router.bind(`${config.routePrefix}/install/:id`, (0, bindPolicies_1.default)(policies, processInstallStep_1.default));
        sails.router.bind(`${config.routePrefix}/install/:id/finalize`, (0, bindPolicies_1.default)(policies, processInstallFinalize_1.default));
        /**
         * Edit form
         * */
        sails.router.bind(`${config.routePrefix}/form/:slug`, (0, bindPolicies_1.default)(policies, form_1.default));
        // upload files to form
        sails.router.bind(`${config.routePrefix}/form/:slug/upload`, (0, bindPolicies_1.default)(policies, upload_1.default));
        //Create a base entity route
        let baseRoute = config.routePrefix + "/:entityType/:entityName";
        /**
         * Do widget helper functions (for now only one case handled)
         */
        sails.router.bind(baseRoute + "/widget", (0, bindPolicies_1.default)(policies, normalizeNavigationConfig_1.default));
        /**
         * Catalog
         */
        sails.router.bind(`${config.routePrefix}/catalog/:slug/:id`, (0, bindPolicies_1.default)(policies, Catalog_1.catalogController));
        sails.router.bind(`${config.routePrefix}/catalog/:slug`, (0, bindPolicies_1.default)(policies, Catalog_1.catalogController));
        /**
         * Media Manager
         */
        sails.router.bind(`${config.routePrefix}/media-manager-uploader/:id`, (0, bindPolicies_1.default)(policies, mediaManagerApi_1.mediaManagerController));
        sails.router.bind(`${config.routePrefix}/get-thumbs`, (0, bindPolicies_1.default)(policies, ThumbController_1.thumbController));
        /**
         * List of records
         */
        sails.router.bind(baseRoute, (0, bindPolicies_1.default)(policies, list_1.default));
        if (config.models) {
            for (let model in config.models) {
                const modelConfig = config.models[model];
                /**
                 * Add support only routes created for boolean true
                 */
                if (typeof modelConfig === "boolean" && modelConfig === true) {
                    adminizer.log.debug(`Adminpanel create CRUD routes for \`${model}\` by boolean true`);
                    sails.router.bind(`${config.routePrefix}/model/${model}/add`, (0, bindPolicies_1.default)(policies, add_1.default));
                    sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, (0, bindPolicies_1.default)(policies, edit_1.default));
                    sails.router.bind(`${config.routePrefix}/model/${model}/remove/:id`, (0, bindPolicies_1.default)(policies, remove_1.default));
                }
                else if (typeof modelConfig !== "boolean") {
                    adminizer.log.debug(`Adminpanel create CRUD routes for \`${model}\` by ModelConfig`);
                    /**
                     * Create new record
                     */
                    if (modelConfig.add) {
                        let addHandler = modelConfig.add;
                        if (addHandler.controller) {
                            let controller = require(addHandler.controller);
                            sails.router.bind(`${config.routePrefix}/model/${model}/add`, (0, bindPolicies_1.default)(policies, controller.default));
                        }
                        else {
                            sails.router.bind(`${config.routePrefix}/model/${model}/add`, (0, bindPolicies_1.default)(policies, add_1.default));
                        }
                    }
                    else {
                        sails.router.bind(`${config.routePrefix}/model/${model}/add`, (0, bindPolicies_1.default)(policies, add_1.default));
                    }
                    /**
                     * Edit existing record
                     */
                    if (modelConfig.edit) {
                        let editHandler = modelConfig.edit;
                        if (editHandler.controller) {
                            let controller = require(editHandler.controller);
                            sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, (0, bindPolicies_1.default)(policies, controller.default));
                        }
                        else {
                            sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, (0, bindPolicies_1.default)(policies, edit_1.default));
                        }
                    }
                    else {
                        sails.router.bind(`${config.routePrefix}/model/${model}/edit/:id`, (0, bindPolicies_1.default)(policies, edit_1.default));
                    }
                }
                else {
                    adminizer.log.silly(`Adminpanel skip create CRUD routes for model: ${model}`);
                }
            }
        }
        /**
         * View record details
         */
        sails.router.bind(baseRoute + "/view/:id", (0, bindPolicies_1.default)(policies, view_1.default));
        sails.router.bind(baseRoute + "/json", (0, bindPolicies_1.default)(policies, listJson_1.default));
        /**
         * Remove record
         */
        sails.router.bind(baseRoute + "/remove/:id", (0, bindPolicies_1.default)(policies, remove_1.default));
        /**
         * Upload files
         */
        sails.router.bind(baseRoute + "/upload", (0, bindPolicies_1.default)(policies, upload_1.default));
        /**
         * Upload images CKeditor5
         */
        sails.router.bind(`${baseRoute}/ckeditor5/upload`, (0, bindPolicies_1.default)(policies, ckeditorUpload_1.default));
        /**
         * Create a default dashboard
         */
        if (Boolean(config.dashboard)) {
            sails.router.bind(config.routePrefix, (0, bindPolicies_1.default)(policies, dashboard_1.default));
        }
        else {
            sails.router.bind(config.routePrefix, (0, bindPolicies_1.default)(policies, welcome_1.default));
        }
        sails.emit("adminpanel:router:binded");
    }
}
Router.onlyOnce = false;
exports.default = Router;
__decorate([
    (0, utils_decorators_1.debounce)(2000)
], Router, "bind", null);
