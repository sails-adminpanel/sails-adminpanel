import bindTranslations from "./bindTranslations";
import bindAuthorization from './bindAuthorization';
import bindAccessRights from "./bindAccessRights";
import bindDev from "./bindDev";
import bindForms from "./bindForms";
import bindDashboardWidgets from "./bindDashboardWidgets";
import Router from "./Router";

import bindNavigation from "./bindNavigation";
import bindMediaManager from "./bindMediaManager";
import bindConfigModels from "./bindConfigModels";
import { Adminizer } from "../lib/v4/config/Adminizer";

export default async function () {

  // Binding list of function for rendering
  require('./bindResView').default();

  // bind config for views
  require('./bindConfig').default();


  if ((process.env.DEV && process.env.NODE_ENV !== 'production') || process.env.ADMINPANEL_FORCE_BIND_DEV === "TRUE") {
    bindDev(adminizer.config)
  }

  if (process.env.NODE_ENV === "production") {
    sails.on('lifted', async function () {
      // Why need wait?
      Router.bind();
    })
  } else {
    Router.bind();
  }


  bindConfigModels(adminizer.config);
  await bindForms();
  await bindDashboardWidgets();

  bindNavigation();
  bindMediaManager();
  await bindAccessRights();

  //binding authorization
  await bindAuthorization();

  if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
    sails.after(["hook:i18n:loaded"], async () => {
      bindTranslations();
    })
  } else {
    adminizer.config.translation = false
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

