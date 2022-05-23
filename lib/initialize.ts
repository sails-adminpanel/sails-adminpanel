import * as fs from 'fs';
import { ViewsHelper } from "../helper/viewsHelper";
import * as path from "path";
import bindAssets from "./bindAssets"
import HookTools from "./hookTools";
import {resolve} from "path";
import afterHook from "./afterHook";

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

    //write out policies to config
    try {
        let policiesDir = fs.readdirSync(__dirname + "./../policies");
        for (let policy of policiesDir) {
            if (path.extname(policy).toLowerCase() === ".js") {
                let policyFile = require(__dirname + "./../policies/" + policy);
                if (typeof policyFile === "function") {
                    sails.config.adminpanel.policies.push(policyFile);
                } else {
                    sails.log.error(`Adminpanel > Policy ${policyFile} is not a function`)
                }
            }
        }
    } catch (e) {
        sails.log.error("Adminpanel > Could not load policies", e)
    }

    // Bind assets
    await bindAssets();
    cb();
};
