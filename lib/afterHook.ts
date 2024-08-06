import bindTranslations from "./bindTranslations";
import bindAuthorization from './bindAuthorization';
import bindAccessRights from "./bindAccessRights";
import bindDev from "./bindDev";
import bindForms from "./bindForms";
import bindDashboardWidgets from "./bindDashboardWidgets";
import Router from "./Router";

import bindNavigation from "./bindNavigation";

export default async function () {
    // Binding list of function for rendering
    require('./bindResView').default();

    // bind config for views
    require('./bindConfig').default();

    //@ts-ignore
    if (sails.config.adminpanel.instances) {
        sails.log.warn('\x1b[33m%s\x1b[0m', "sails.config.adminpanel.instances is deprecated")
        sails.log.warn('\x1b[33m%s\x1b[0m', "use sails.config.adminpanel.models instead")
        sails.log.warn('\x1b[33m%s\x1b[0m', "sails.config.adminpanel.instances will not be supported anymore in version 3.0.0")
        sails.log.warn('\x1b[33m%s\x1b[0m', "!!! sails.config.adminpanel.models replaced by sails.config.adminpanel.instances !!!")
        //@ts-ignore
        sails.config.adminpanel.models = {...sails.config.adminpanel.instances}
        //@ts-ignore
        delete sails.config.adminpanel.instances;
    }

    if ((process.env.DEV && process.env.NODE_ENV !== 'production') || process.env.ADMINPANEL_FORCE_BIND_DEV === "TRUE") {
        bindDev(sails.config.adminpanel)
    }

    if(process.env.NODE_ENV === "production") {
        sails.on('lifted', async function() {
            // Why need wait?
            Router.bind();
        })
    } else {
        Router.bind();
    }

    bindForms();
    bindDashboardWidgets();

	bindNavigation();

    //bind access rights
    bindAccessRights();

    //binding authorization
    await bindAuthorization();

    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            bindTranslations();
        })
    } else {
        sails.config.adminpanel.translation = false
    }

    sails.after(["hook:i18n:loaded"], async () => {
        bindTranslations();
    })

    /**
     * AfterHook emit
     * This call is used so that other hooks can know that the admin panel is present in the panel and has been loaded, and can activate their logic.
     */
    sails.emit('Adminpanel:afterHook:loaded');

	return
};
