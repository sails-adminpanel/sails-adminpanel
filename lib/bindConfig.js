"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewsHelper_1 = require("../helper/viewsHelper");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const menuHelper_1 = require("../helper/menuHelper");
const configHelper_1 = require("../helper/configHelper");
function bindConfig() {
    /**
     * Bind adminpanel config to views
     */
    if (!sails.config.adminpanel.pathToViews) {
        sails.config.adminpanel.pathToViews = viewsHelper_1.ViewsHelper.getPathToEngine("ejs");
    }
    // binding locals
    if (!sails.config.views.locals) {
        sails.config.views.locals = {};
    }
    //Creating params for admin panel views.
    if (!sails.config.views.locals.adminpanel) {
        sails.config.views.locals.adminpanel = {};
    }
    sails.config.views.locals.adminpanel.config = sails.config.adminpanel;
    sails.config.views.locals.adminpanel.viewHelper = viewsHelper_1.ViewsHelper;
    sails.config.views.locals.adminpanel.fieldsHelper = fieldsHelper_1.FieldsHelper;
    sails.config.views.locals.adminpanel.menuHelper = new menuHelper_1.MenuHelper(sails.config.adminpanel);
    sails.config.views.locals.adminpanel.configHelper = configHelper_1.ConfigHelper;
}
exports.default = bindConfig;
;
