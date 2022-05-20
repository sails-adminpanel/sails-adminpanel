import bindTranslations from "./bindTranslations";

let flash = require('connect-flash');
import * as bindAuthorization from './bindAuthorization';

export default function ToAfterHooksLoaded() {
    sails.hooks.http.app.use(flash());
    return function afterHooksLoaded() {
        // Binding list of function for rendering
        require('./bindResView').default();

        // bind config for views
        require('./bindConfig').default();

        //binding all routes.
        require('./bindRoutes').default();

        //binding authorization
        bindAuthorization();

        if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
            sails.after(["hook:i18n:loaded"], async () => {
                await bindTranslations();
            })
        }
    };
};
