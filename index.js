'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const widgetHandler_1 = require("./lib/widgets/widgetHandler");
const { MenuHelper } = require('./helper/menuHelper');
const { ConfigHelper } = require('./helper/configHelper');
const { AccessRightsHelper } = require('./helper/accessRightsHelper');
const { InstallStepper } = require("./lib/installStepper/installStepper");
const CatalogHandler_1 = require("./lib/catalog/CatalogHandler");
module.exports = function () {
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
            throw `Not implemented adminpanel index file addMenuItem`;
        },
        addGroup: function (key, title) {
            throw `Not implemented adminpanel index file addGroup`;
        },
        addModelConfig: ConfigHelper.addModelConfig,
        registerAccessToken: AccessRightsHelper.registerToken,
        getAllAccessTokens: AccessRightsHelper.getTokens,
        havePermission: AccessRightsHelper.havePermission,
        enoughPermissions: AccessRightsHelper.enoughPermissions,
        getInstallStepper: () => InstallStepper,
        getWidgetHandler: () => widgetHandler_1.WidgetHandler,
        getCatalogHandler: () => CatalogHandler_1.CatalogHandler,
    };
};
