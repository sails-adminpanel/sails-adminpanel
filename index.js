'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const widgetHandler_1 = require("./lib/widgets/widgetHandler");
const { MenuHelper } = require('./helper/menuHelper');
const { ConfigHelper } = require('./helper/configHelper');
const { AccessRightsHelper } = require('./helper/accessRightsHelper');
const { InstallStepper } = require("./lib/installStepper/installStepper");
const { CatalogHandler } = require("./lib/catalog/CatalogHandler");
module.exports = function (sails) {
    let libInitialize = require("./lib/initialize");
    return {
        /**
         * Creating default settings for hook
         */
        defaults: require('./lib/defaults').defaults(),
        configure: require('./lib/configure').default(),
        initialize: async function initialize(cb) {
            await libInitialize.default(sails, cb);
        },
        addMenuItem: function (link, label, icon, group) {
            if (!link)
                throw 'first argument is required';
            sails.config.adminpanel.menu = sails.config.adminpanel.menu || {};
            sails.config.adminpanel.menu.actions = sails.config.adminpanel.menu.actions || [];
            sails.config.adminpanel.menu.actions.push({
                link: link,
                title: label || link,
                icon: icon,
                menuGroup: group
            });
            sails.config.views.locals.adminpanel.menuHelper = new MenuHelper(sails.config.adminpanel);
        },
        addGroup: function (key, title) {
            if (!key)
                throw 'first argument is required';
            sails.config.adminpanel.menu = sails.config.adminpanel.menu || {};
            sails.config.adminpanel.menu.groups = sails.config.adminpanel.menu.groups || [];
            sails.config.adminpanel.menu.groups.push({
                key: key,
                title: title || key,
            });
        },
        addModelConfig: ConfigHelper.addModelConfig,
        registerAccessToken: AccessRightsHelper.registerToken,
        getAllAccessTokens: AccessRightsHelper.getTokens,
        havePermission: AccessRightsHelper.havePermission,
        enoughPermissions: AccessRightsHelper.enoughPermissions,
        getInstallStepper: () => InstallStepper,
        getWidgetHandler: () => widgetHandler_1.WidgetHandler,
        CatalogHandler: () => CatalogHandler,
    };
};
