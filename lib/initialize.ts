// import * as fs from 'fs';
// import { ViewsHelper } from "../helper/viewsHelper";
// import * as path from "path";
// import bindAssets from "./bindAssets"
// import HookTools from "./hookTools";
// import {resolve} from "path";
// import afterHook from "./afterHook";
// import bindInstallStepper from "./bindInstallStepper";
import {Adminizer, AdminpanelConfig, WaterlineAdapter} from "adminizer";
const Waterline = require('waterline');
//@ts-ignore
import sailsDisk from "sails-disk";
const adminpanelConfig = require("../test/adminizerConfig")

export default async function (sails: any, cb: (err?: Error) => void) {

	let adminizer: Adminizer

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
	console.log('test hook >>>>>>>>>>>>>>>>')

	const orm = new Waterline();

	await WaterlineAdapter.registerSystemModels(orm)

	const diskAdapterWithDefaults = {
		...sailsDisk,
		defaults: {
			migrate: 'alter',
			schema: true,
			attributes: {
				id: {type: 'number', autoMigrations: {autoIncrement: true}},
				createdAt: {type: 'number', autoMigrations: {columnType: 'bigint'}},
				updatedAt: {type: 'number', autoMigrations: {columnType: 'bigint'}}
			}
		}
	};

	// 2. Конфигурация Waterline
	const waterlineConfig = {
		adapters: {
			'disk': diskAdapterWithDefaults
		},
		datastores: {
			default: {
				adapter: 'disk',
				inMemoryOnly: true
			}
		}
	};

	const ontology = await new Promise<any>((resolve, reject) => {
		orm.initialize(waterlineConfig, (err: any, ontology: any) => {
			if (err) return reject(err);
			resolve(ontology);
		});
	});
	const waterlineAdapter = new WaterlineAdapter({orm, ontology});
	adminizer = new Adminizer([waterlineAdapter])
	// console.log(sails.config.adminpanel)
	await adminizer.init(sails.config.adminpanel as unknown as AdminpanelConfig)
	console.log(adminizer)

	// const ontology = await new Promise((resolve, reject) => {
	// 	orm.initialize(sails.config.models, (err: any, ontology: any) => {
	// 		if (err) return reject(err);
	// 		resolve(ontology);
	// 	});
	// });
	//
	// const waterlineAdapter = new WaterlineAdapter({ orm, ontology });
	// const adminizer = new Adminizer([waterlineAdapter]);
	// console.log(adminizer)

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
};
