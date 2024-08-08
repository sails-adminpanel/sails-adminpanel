import { ViewsHelper } from "../helper/viewsHelper";
import { FieldsHelper } from "../helper/fieldsHelper";
import { MenuHelper } from "../helper/menuHelper";
import { ConfigHelper } from "../helper/configHelper";

export default function bindConfig() {
    /**
     * Bind adminpanel config to views
     */
    if (!sails.config.adminpanel.pathToViews) {
        sails.config.adminpanel.pathToViews = ViewsHelper.getPathToEngine("ejs");
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
    sails.config.views.locals.adminpanel.viewHelper = ViewsHelper;
    sails.config.views.locals.adminpanel.fieldsHelper = FieldsHelper;
    sails.config.views.locals.adminpanel.menuHelper = new MenuHelper(sails.config.adminpanel);
    sails.config.views.locals.adminpanel.configHelper = ConfigHelper;
};
