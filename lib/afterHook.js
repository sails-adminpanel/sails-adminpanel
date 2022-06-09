"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bindTranslations_1 = require("./bindTranslations");
const bindAuthorization_1 = require("./bindAuthorization");
const bindAccessRights_1 = require("./bindAccessRights");
const bindDev_1 = require("./bindDev");
async function default_1() {
    // Binding list of function for rendering
    require('./bindResView').default();
    // bind config for views
    require('./bindConfig').default();
    //binding all routes.
    require('./bindRoutes').default();
    if (process.env.DEV && process.env.NODE_ENV !== 'production') {
        bindDev_1.default(sails.config.adminpanel);
    }
    //bind access rights
    bindAccessRights_1.default();
    //binding authorization
    await bindAuthorization_1.default();
    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            await bindTranslations_1.default();
        });
    }
    return;
}
exports.default = default_1;
;
