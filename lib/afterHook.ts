import bindTranslations from "./bindTranslations";
import bindAuthorization from './bindAuthorization';
import bindAccessRights from "./bindAccessRights";
import bindDev from "./bindDev";
import bindForms from "./bindForms";

export default async function () {
    // Binding list of function for rendering
    require('./bindResView').default();

    // bind config for views
    require('./bindConfig').default();

    if (process.env.DEV && process.env.NODE_ENV !== 'production') {
        bindDev(sails.config.adminpanel)
    }

    sails.on('lifted', async function() {
        //binding all routes.
        require('./bindRoutes').default();
    })

    //bind access rights
    bindAccessRights();

    //binding authorization
    await bindAuthorization();

    // binding forms from files
    bindForms();

    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            bindTranslations();
        })
    } else {
        sails.config.adminpanel.translation = false
    }
    return
};
