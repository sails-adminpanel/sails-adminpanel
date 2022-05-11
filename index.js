'use strict';
let { MenuHelper } = require('./helper/menuHelper');

module.exports = function (sails) {

    return {

        /**
         * Creating default settings for hook
         */
        defaults: require('./lib/defaults').content,

        configure: require('./lib/configure').default(),

        initialize: require('./lib/initialize').default(),

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
        }
    };
};

