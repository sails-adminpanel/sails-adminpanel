"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToConfigure;
function ToConfigure() {
    return function configure() {
        // Check for disable admin panel
        if (!adminizer.config) {
            return;
        }
        // !TODO add styles render in ejs
        adminizer.config.styles = [];
        // !TODO add scripts
        adminizer.config.scripts = {};
        adminizer.config.scripts.header = [];
        adminizer.config.scripts.footer = [];
        adminizer.config.policies = [];
        //recheck route prefix
        adminizer.config.routePrefix = adminizer.config.routePrefix || '/admin';
        //check and adding base slash
        if (adminizer.config.routePrefix.indexOf('/') != 0) {
            adminizer.config.routePrefix = '/' + adminizer.config.routePrefix;
        }
    };
}
;
