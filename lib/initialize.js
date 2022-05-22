"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const viewsHelper_1 = require("../helper/viewsHelper");
const path = require("path");
const bindAssets_1 = require("./bindAssets");
const hookTools_1 = require("./hookTools");
const path_1 = require("path");
const afterHook_1 = require("./afterHook");
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
    //Check views engine and check if folder with templates exist
    if (!fs.existsSync(viewsHelper_1.ViewsHelper.getPathToEngine(sails.config.views.extension))) {
        return cb(new Error('For now adminpanel hook could work only with Pug template engine.'));
    }
    require('./initializeAuthorization').default(cb);
    sails.config.adminpanel.templateRootPath = viewsHelper_1.ViewsHelper.BASE_VIEWS_PATH;
    sails.config.adminpanel.rootPath = path.resolve(__dirname + "/..");
    hookTools_1.default.waitForHooks("adminpanel", requiredHooks, afterHook_1.default);
    await hookTools_1.default.bindModels((0, path_1.resolve)(__dirname, "../models"));
    // Bind assets
    await (0, bindAssets_1.default)();
    cb();
}
exports.default = default_1;
;
