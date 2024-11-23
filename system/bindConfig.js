"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindConfig;
const viewsHelper_1 = require("../helper/viewsHelper");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const menuHelper_1 = require("../helper/menuHelper");
const configHelper_1 = require("../helper/configHelper");
function bindConfig() {
    /**
     * Bind adminpanel config to views
     */
    if (!adminizer.config.pathToViews) {
        adminizer.config.pathToViews = viewsHelper_1.ViewsHelper.getPathToEngine("ejs");
    }
    // binding locals
    if (!sails.config.views.locals) {
        sails.config.views.locals = {};
    }
    //Creating params for admin panel views.
    if (!sails.config.views.locals.adminpanel) {
        sails.config.views.locals.adminpanel = {};
    }
    sails.config.views.locals.adminpanel.config = adminizer.config;
    sails.config.views.locals.adminpanel.viewHelper = viewsHelper_1.ViewsHelper;
    sails.config.views.locals.adminpanel.fieldsHelper = fieldsHelper_1.FieldsHelper;
    sails.config.views.locals.adminpanel.menuHelper = new menuHelper_1.MenuHelper(adminizer.config);
    sails.config.views.locals.adminpanel.configHelper = configHelper_1.ConfigHelper;
}
;
