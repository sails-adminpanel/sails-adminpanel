"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const viewsHelper_1 = require("../helper/viewsHelper");
const path = require("path");
const bindAssets_1 = require("./bindAssets");
const hookTools_1 = require("./hookTools");
const path_1 = require("path");
const afterHook_1 = require("./afterHook");
const migrationsHelper_1 = require("../helper/migrationsHelper");
const bindInstallStepper_1 = require("./bindInstallStepper");
async function default_1(sails, cb) {
    /**
     * List of hooks that required for adminpanel to work
     */
    let requiredHooks = [
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
    /**
     * Initilization emit
     * This call is used so that other hooks can know that the admin panel is present in the panel, and can activate their logic.
     */
    sails.emit('Adminpanel:initialization');
    //Check views engine and check if folder with templates exist
    if (!fs.existsSync(viewsHelper_1.ViewsHelper.getPathToEngine(sails.config.views.extension))) {
        return cb(new Error('For now adminpanel hook could work only with EJS template engine.'));
    }
    sails.config.adminpanel.templateRootPath = viewsHelper_1.ViewsHelper.BASE_VIEWS_PATH;
    sails.config.adminpanel.rootPath = path.resolve(__dirname + "/..");
    hookTools_1.default.waitForHooks("adminpanel", requiredHooks, afterHook_1.default);
    await hookTools_1.default.bindModels(path_1.resolve(__dirname, "../models"));
    // add install stepper policy to check unfilled settings
    bindInstallStepper_1.default();
    // if (!sails.hooks.i18n.locales) sails.hooks.i18n.locales = []
    // sails.hooks.i18n.locales = [...sails.hooks.i18n.locales, ...sails.config.adminpanel.translation.locales]
    //     .filter(function(item, pos, self) { return self.indexOf(item) == pos })
    /**
     * !TODO: It is worth rewriting the miration so that it is an abstract adapter
     */
    if ((process.env.NODE_ENV === "production" && process.env.DATASTORE === "postgres" && process.env.ADMINPANEL_MIGRATIONS_ENABLE === "TRUE") || process.env.ADMINPANEL_MIGRATIONS_FORCE === "TRUE") {
        if (process.env.ADMINPANEL_MIGRATIONS_SKIP !== "TRUE") {
            await migrationsHelper_1.MigrationsHelper.addToProcessMigrationsQueue(`${sails.config.adminpanel.rootPath}/migrations`, "up");
        }
    }
    // run project migrations
    if (process.env.AUTO_MIGRATIONS) {
        try {
            await migrationsHelper_1.MigrationsHelper.addToProcessMigrationsQueue(sails.config.adminpanel.migrations.path, "up");
            sails.log.info(`Automigrations completed`);
        }
        catch (e) {
            sails.log.error(`Error trying to run automigrations, path: ${sails.config.adminpanel.migrations.path}`);
        }
    }
    // Bind assets
    await bindAssets_1.default();
    cb();
}
exports.default = default_1;
;
