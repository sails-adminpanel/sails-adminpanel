"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let flash = require('connect-flash');
const bindAuthorization = require("./bindAuthorization");
function ToAfterHooksLoaded() {
    sails.hooks.http.app.use(flash());
    return function afterHooksLoaded() {
        // Binding list of function for rendering
        require('./bindResView').default();
        // bind config for views
        require('./bindConfig').default();
        //binding all routes.
        require('./bindRoutes').default();
        //binding authorization
        bindAuthorization();
    };
}
exports.default = ToAfterHooksLoaded;
;
