import bindTranslations from "./bindTranslations";
import bindAuthorization from './bindAuthorization';
import bindAccessRights from "./bindAccessRights";
import bindDev from "./bindDev";

export default async function () {
    // Binding list of function for rendering
    require('./bindResView').default();

    // bind config for views
    require('./bindConfig').default();

    if (process.env.DEV && process.env.NODE_ENV !== 'production') {
        bindDev(sails.config.adminpanel)
    }

    //binding all routes.
    require('./bindRoutes').default();

    //bind access rights
    bindAccessRights();

    //binding authorization
    await bindAuthorization();

    if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
        sails.after(["hook:i18n:loaded"], async () => {
            await bindTranslations();
        })
    }
    return
};
