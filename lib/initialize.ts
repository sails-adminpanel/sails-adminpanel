import * as fs from 'fs';
import { ViewsHelper } from "../helper/viewsHelper";
import * as path from "path";
import bindAssets from "./bindAssets"
import HookTools from "./hookTools";
import {resolve} from "path";
import afterHook from "./afterHook";
import { MigrationsHelper } from "../helper/migrationsHelper";

export default async function(sails: any, cb) {

    /**
     * List of hooks that required for adminpanel to work
     */
    let requiredHooks: string[] = [
        'blueprints',
        'http',
        'orm',
        'policies',
        'views'
    ];

    // If disabled. Do not load anything
    if (!sails.config.adminpanel) {
        return cb();
    }

    //Check views engine and check if folder with templates exist
    if (!fs.existsSync(ViewsHelper.getPathToEngine(sails.config.views.extension))) {
        return cb(new Error('For now adminpanel hook could work only with Pug template engine.'));
    }

    require('./initializeAuthorization').default(cb);

    sails.config.adminpanel.templateRootPath = ViewsHelper.BASE_VIEWS_PATH;
    sails.config.adminpanel.rootPath = path.resolve(__dirname + "/..")

    HookTools.waitForHooks("adminpanel", requiredHooks, afterHook);
    await HookTools.bindModels(resolve(__dirname, "../models"));

    // if (!sails.hooks.i18n.locales) sails.hooks.i18n.locales = []
    // sails.hooks.i18n.locales = [...sails.hooks.i18n.locales, ...sails.config.adminpanel.translation.locales]
    //     .filter(function(item, pos, self) { return self.indexOf(item) == pos })

    // run adminpanel migrations
    if (process.env.NODE_ENV === "production") {
        await MigrationsHelper.addToProcessMigrationsQueue(`${sails.config.adminpanel.rootPath}/migrations`, "up");
    }

    // run project migrations
    if (process.env.AUTO_MIGRATIONS) {
        try {
            await MigrationsHelper.addToProcessMigrationsQueue(sails.config.adminpanel.migrations.path, "up");
            sails.log.info(`Automigrations completed`)
        } catch (e) {
            sails.log.error(`Error trying to run automigrations, path: ${sails.config.adminpanel.migrations.path}`);
        }
    }

    // Bind assets
    await bindAssets();
    cb();
};
