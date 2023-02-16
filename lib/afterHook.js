"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bindTranslations_1 = require("./bindTranslations");
const bindAuthorization_1 = require("./bindAuthorization");
const bindAccessRights_1 = require("./bindAccessRights");
const bindDev_1 = require("./bindDev");
const bindForms_1 = require("./bindForms");
const migrationsHelper_1 = require("../helper/migrationsHelper");
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
    if (process.env.DEV && process.env.NODE_ENV !== 'production') {
        bindDev_1.default(sails.config.adminpanel);
    }
    sails.on('lifted', async function () {
        migrationsHelper_1.default.processDatastoreAdapter();
        //binding all routes.
        require('./bindRoutes').default();
        // binding forms from files
    });
    bindForms_1.default();
    //bind access rights
    bindAccessRights_1.default();
    //binding authorization
    await bindAuthorization_1.default();
    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            bindTranslations_1.default();
        });
    }
    else {
        sails.config.adminpanel.translation = false;
    }
    sails.after(["hook:i18n:loaded"], async () => {
        bindTranslations_1.default();
    });
    return;
}
exports.default = default_1;
;
