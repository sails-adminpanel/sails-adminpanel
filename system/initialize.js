"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const fs = require("fs");
const viewsHelper_1 = require("../helper/viewsHelper");
const path = require("path");
const bindAssets_1 = require("./bindAssets");
const hookTools_1 = require("./hookTools");
const path_1 = require("path");
const afterHook_1 = require("./afterHook");
const bindInstallStepper_1 = require("./bindInstallStepper");
async function default_1(sails, cb) {
    /**
     * List of hooks that required for adminpanel to work
     */
    let requiredHooks = [
        'http',
        'orm',
        'policies',
        'views'
    ];
    // If disabled. Do not load anything
    if (!adminizer.config) {
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
    adminizer.config.templateRootPath = viewsHelper_1.ViewsHelper.BASE_VIEWS_PATH;
    adminizer.config.rootPath = path.resolve(__dirname + "/..");
    hookTools_1.default.waitForHooks("adminpanel", requiredHooks, afterHook_1.default);
    const modelsToSkip = [];
    if (adminizer.config.navigation?.model)
        modelsToSkip.push('navigationap');
    await hookTools_1.default.bindModels((0, path_1.resolve)(__dirname, "../models"));
    // add install stepper policy to check unfilled settings
    (0, bindInstallStepper_1.default)();
    // if (!sails.hooks.i18n.locales) sails.hooks.i18n.locales = []
    // sails.hooks.i18n.locales = [...sails.hooks.i18n.locales, ...adminizer.config.translation.locales]
    //     .filter(function(item, pos, self) { return self.indexOf(item) == pos })
    // Bind assets
    (0, bindAssets_1.default)();
    cb();
}
;
