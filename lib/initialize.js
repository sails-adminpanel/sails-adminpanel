"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
// import * as fs from 'fs';
// import { ViewsHelper } from "../helper/viewsHelper";
// import * as path from "path";
// import bindAssets from "./bindAssets"
// import HookTools from "./hookTools";
// import {resolve} from "path";
// import afterHook from "./afterHook";
// import bindInstallStepper from "./bindInstallStepper";
const adminizer_1 = require("adminizer");
const Waterline = require('waterline');
async function default_1(sails, cb) {
    console.log(adminizer_1.WaterlineAdapter);
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
    if (!sails.config.adminpanel) {
        return cb();
    }
    /**
     * Initilization emit
     * This call is used so that other hooks can know that the admin panel is present in the panel, and can activate their logic.
     */
    sails.emit('Adminpanel:initialization');
    console.log('test hook >>>>>>>>>>>>>>>>');
    const orm = new Waterline();
    await adminizer_1.WaterlineAdapter.registerSystemModels(orm);
    const ontology = await new Promise((resolve, reject) => {
        orm.initialize(sails.config.models, (err, ontology) => {
            if (err)
                return reject(err);
            resolve(ontology);
        });
    });
    const waterlineAdapter = new adminizer_1.WaterlineAdapter({ orm, ontology });
    const adminizer = new adminizer_1.Adminizer([waterlineAdapter]);
    console.log(adminizer);
    //Check views engine and check if folder with templates exist
    // if (!fs.existsSync(ViewsHelper.getPathToEngine(sails.config.views.extension))) {
    //     return cb(new Error('For now adminpanel hook could work only with EJS template engine.'));
    // }
    //
    // sails.config.adminpanel.templateRootPath = ViewsHelper.BASE_VIEWS_PATH;
    // sails.config.adminpanel.rootPath = path.resolve(__dirname + "/..")
    //
    // HookTools.waitForHooks("adminpanel", requiredHooks, afterHook);
    // const modelsToSkip = []
    // if(sails.config.adminpanel.navigation?.model) modelsToSkip.push('navigationap')
    // await HookTools.bindModels(resolve(__dirname, "../models"));
    // add install stepper policy to check unfilled settings
    // bindInstallStepper();
    // if (!sails.hooks.i18n.locales) sails.hooks.i18n.locales = []
    // sails.hooks.i18n.locales = [...sails.hooks.i18n.locales, ...sails.config.adminpanel.translation.locales]
    //     .filter(function(item, pos, self) { return self.indexOf(item) == pos })
    // Bind assets
    // bindAssets();
    cb();
}
;
