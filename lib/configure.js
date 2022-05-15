"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ToConfigure() {
    return function configure() {
        // Check for disable admin panel
        if (!sails.config.adminpanel) {
            return;
        }
        // !TODO add styles render in ejs
        sails.config.adminpanel.styles = [];
        // !TODO add scripts
        sails.config.adminpanel.script = {};
        sails.config.adminpanel.script.header = [];
        sails.config.adminpanel.script.footer = [];
        //recheck route prefix
        sails.config.adminpanel.routePrefix = sails.config.adminpanel.routePrefix || '/admin';
        //check and adding base slash
        if (sails.config.adminpanel.routePrefix.indexOf('/') != 0) {
            sails.config.adminpanel.routePrefix = '/' + sails.config.adminpanel.routePrefix;
        }
    };
}
exports.default = ToConfigure;
;
