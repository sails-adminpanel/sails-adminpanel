"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bindTranslations_1 = require("./bindTranslations");
const bindAuthorization_1 = require("./bindAuthorization");
const bindAccessRights_1 = require("./bindAccessRights");
const bindDev_1 = require("./bindDev");
const bindForms_1 = require("./bindForms");
const bindDashboardWidgets_1 = require("./bindDashboardWidgets");
const Router_1 = require("./Router");
const CatalogHandler_1 = require("./catalog/CatalogHandler");
// Delete it after finish develop catalog feature
const TestCatalog_1 = require("../test/TestCatalog/TestCatalog");
async function default_1() {
    // Binding list of function for rendering
    require('./bindResView').default();
    // bind config for views
    require('./bindConfig').default();
    //@ts-ignore
    if (sails.config.adminpanel.instances) {
        sails.log.warn('\x1b[33m%s\x1b[0m', "sails.config.adminpanel.instances is deprecated");
        sails.log.warn('\x1b[33m%s\x1b[0m', "use sails.config.adminpanel.models instead");
        sails.log.warn('\x1b[33m%s\x1b[0m', "sails.config.adminpanel.instances will not be supported anymore in version 3.0.0");
        sails.log.warn('\x1b[33m%s\x1b[0m', "!!! sails.config.adminpanel.models replaced by sails.config.adminpanel.instances !!!");
        //@ts-ignore
        sails.config.adminpanel.models = { ...sails.config.adminpanel.instances };
        //@ts-ignore
        delete sails.config.adminpanel.instances;
    }
    if ((process.env.DEV && process.env.NODE_ENV !== 'production') || process.env.ADMINPANEL_FORCE_BIND_DEV === "TRUE") {
        (0, bindDev_1.default)(sails.config.adminpanel);
    }
    sails.on('lifted', async function () {
        //binding all routes.
        Router_1.default.bind();
    });
    (0, bindForms_1.default)();
    (0, bindDashboardWidgets_1.default)();
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
    if (process.env.NODE_ENV !== "production") {
        let catalog = new TestCatalog_1.TestCatalog();
        CatalogHandler_1.CatalogHandler.add(catalog);
        require("./../test/TestCatalog/genData").createTestData();
    }
    return;
}
exports.default = default_1;
;
