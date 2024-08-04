import * as fs from 'fs';
import { ViewsHelper } from "../helper/viewsHelper";
import * as path from "path";
import bindAssets from "./bindAssets"
import HookTools from "./hookTools";
import {resolve} from "path";
import afterHook from "./afterHook";
import bindInstallStepper from "./bindInstallStepper";

export default async function(sails: any, cb) {



    /**
     * List of hooks that required for adminpanel to work
     */
    let requiredHooks: string[] = [
        'http',
        'orm',
        'policies',
        'views'
    ];

    // If disabled. Do not load anything
    if (!sails.config.adminpanel) {
        return cb();
    }

    /**
     * Initilization emit
     * This call is used so that other hooks can know that the admin panel is present in the panel, and can activate their logic.
     */

    sails.emit('Adminpanel:initialization');

    //Check views engine and check if folder with templates exist
    if (!fs.existsSync(ViewsHelper.getPathToEngine(sails.config.views.extension))) {
        return cb(new Error('For now adminpanel hook could work only with EJS template engine.'));
    }

    sails.config.adminpanel.templateRootPath = ViewsHelper.BASE_VIEWS_PATH;
    sails.config.adminpanel.rootPath = path.resolve(__dirname + "/..")

    HookTools.waitForHooks("adminpanel", requiredHooks, afterHook);
	const modelsToSkip = []
	if(sails.config.adminpanel.navigation.model) modelsToSkip.push('navigationap')
    await HookTools.bindModels(resolve(__dirname, "../models"));

    // add install stepper policy to check unfilled settings
    bindInstallStepper();

    // if (!sails.hooks.i18n.locales) sails.hooks.i18n.locales = []
    // sails.hooks.i18n.locales = [...sails.hooks.i18n.locales, ...sails.config.adminpanel.translation.locales]
    //     .filter(function(item, pos, self) { return self.indexOf(item) == pos })

    // Bind assets
    await bindAssets();
    cb();
};
