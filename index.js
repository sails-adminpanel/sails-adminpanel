'use strict';
let { MenuHelper } = require('./helper/menuHelper');
let { AccessRightsHelper } = require('./helper/accessRightsHelper');

module.exports = function (sails) {

    let libInitialize =  require("./lib/initialize");

    return {

        /**
         * Creating default settings for hook
         */
        defaults: require('./lib/defaults').content,

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
                title: label || key,
            });
        },

        registerAccessToken: AccessRightsHelper.registerToken,

        getAllAccessTokens: AccessRightsHelper.getTokens,

        havePermission: AccessRightsHelper.havePermission,

        enoughPermissions: AccessRightsHelper.enoughPermissions

    };
};

