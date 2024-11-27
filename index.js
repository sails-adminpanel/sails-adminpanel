"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./interfaces/global.ts" />
const widgetHandler_1 = require("./lib/widgets/widgetHandler");
const { MenuHelper } = require('./helper/menuHelper');
const { ConfigHelper } = require('./helper/configHelper');
const { AccessRightsHelper } = require('./helper/accessRightsHelper');
const { InstallStepper } = require("./lib/installStepper/installStepper");
const CatalogHandler_1 = require("./lib/catalog/CatalogHandler");
const MediaManagerHandler_1 = require("./lib/media-manager/MediaManagerHandler");
const Adminizer_1 = require("./lib/v4/config/Adminizer");
let adminizer = new Adminizer_1.Adminizer();
//@ts-ignore problem need to fix
global.adminizer = adminizer;
module.exports = function () {
    let libInitialize = require("./system/initialize");
    return {
        /**
         * Creating default settings for hook
         */
        defaults: require('./system/defaults').defaults(),
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
        getMediaManagerHandler: () => MediaManagerHandler_1.MediaManagerHandler,
    };
};
