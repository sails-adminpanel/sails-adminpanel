"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bindTranslations_1 = require("./bindTranslations");
let flash = require('connect-flash');
const bindAuthorization = require("./bindAuthorization");
async function default_1() {
    sails.hooks.http.app.use(flash());
    // Binding list of function for rendering
    require('./bindResView').default();
    // bind config for views
    require('./bindConfig').default();
    //binding all routes.
    require('./bindRoutes').default();
    //binding authorization
    bindAuthorization();
    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            await (0, bindTranslations_1.default)();
        });
    }
    return;
}
exports.default = default_1;
;
