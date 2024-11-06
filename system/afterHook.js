"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const bindTranslations_1 = require("./bindTranslations");
const bindAuthorization_1 = require("./bindAuthorization");
const bindAccessRights_1 = require("./bindAccessRights");
const bindDev_1 = require("./bindDev");
const bindForms_1 = require("./bindForms");
const bindDashboardWidgets_1 = require("./bindDashboardWidgets");
const Router_1 = require("./Router");
const bindNavigation_1 = require("./bindNavigation");
const bindMediaManager_1 = require("./bindMediaManager");
const bindConfigModels_1 = require("./bindConfigModels");
async function default_1() {
    // Binding list of function for rendering
    require('./bindResView').default();
    // bind config for views
    require('./bindConfig').default();
    if ((process.env.DEV && process.env.NODE_ENV !== 'production') || process.env.ADMINPANEL_FORCE_BIND_DEV === "TRUE") {
        (0, bindDev_1.default)(sails.config.adminpanel);
    }
    if (process.env.NODE_ENV === "production") {
        sails.on('lifted', async function () {
            // Why need wait?
            Router_1.default.bind();
        });
    }
    else {
        Router_1.default.bind();
    }
    (0, bindConfigModels_1.default)(sails.config.adminpanel);
    (0, bindForms_1.default)();
    (0, bindDashboardWidgets_1.default)();
    (0, bindNavigation_1.default)();
    (0, bindMediaManager_1.default)();
    //bind access rights
    (0, bindAccessRights_1.default)();
    //binding authorization
    await (0, bindAuthorization_1.default)();
    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            (0, bindTranslations_1.default)();
        });
    }
    else {
        sails.config.adminpanel.translation = false;
    }
    sails.after(["hook:i18n:loaded"], async () => {
        (0, bindTranslations_1.default)();
    });
    /**
     * AfterHook emit
     * This call is used so that other hooks can know that the admin panel is present in the panel and has been loaded, and can activate their logic.
     */
    sails.emit('Adminpanel:afterHook:loaded');
    return;
}
;
