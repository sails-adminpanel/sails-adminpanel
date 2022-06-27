"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bindTranslations_1 = require("./bindTranslations");
const bindAuthorization_1 = require("./bindAuthorization");
const bindAccessRights_1 = require("./bindAccessRights");
const bindDev_1 = require("./bindDev");
const bindForms_1 = require("./bindForms");
async function default_1() {
    // Binding list of function for rendering
    require('./bindResView').default();
    // bind config for views
    require('./bindConfig').default();
    if (process.env.DEV && process.env.NODE_ENV !== 'production') {
        (0, bindDev_1.default)(sails.config.adminpanel);
    }
    sails.on('lifted', async function () {
        //binding all routes.
        require('./bindRoutes').default();
    });
    //bind access rights
    (0, bindAccessRights_1.default)();
    //binding authorization
    await (0, bindAuthorization_1.default)();
    // binding forms from files
    (0, bindForms_1.default)();
    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            (0, bindTranslations_1.default)();
        });
    }
    else {
        sails.config.adminpanel.translation = false;
    }
    return;
}
exports.default = default_1;
;
