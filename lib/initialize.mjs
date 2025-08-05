// ESM initialize.mjs - главная логика инициализации adminpanel
import {HookTools} from "./hookTools.js";

async function afterHook() {
	// const [{Adminizer}, {WaterlineAdapter}] = await Promise.all([
	// 	import('adminizer'),
	// 	import('./SailsORMAdapter.js'),
	// ]);
	console.log(sails.hooks.orm)
	// console.log('🚀 Starting adminpanel initialization...');
	//
	// const waterlineAdapter = new WaterlineAdapter(sails.models);
	//
	// console.log('⚙️ Creating Adminizer instance...');
	// const adminizer = new Adminizer([waterlineAdapter]);
	//
	// const adminpanelConfig = {
	// 	routePrefix: sails.config.adminpanel?.routePrefix || '/admin',
	// 	auth: false,
	// 	models: {},
	// 	mediamanager: {
	// 		fileStoragePath: `${process.cwd()}/.tmp/public`,
	// 		allowMIME: ['image/*', 'application/*', 'text/*', 'video/*'],
	// 		maxByteSize: 1024 * 1024 * 2, // 2 Mb
	// 		imageSizes: {
	// 			lg: {
	// 				width: 750,
	// 				height: 750
	// 			},
	// 			sm: {
	// 				width: 350,
	// 				height: 350
	// 			}
	// 		},
	// 	},
	// };
	//
	// console.log('🔄 Initializing Adminizer...');
	// await adminizer.init(adminpanelConfig);
	//
	// sails.adminizer = adminizer;
	//
	// console.log('🎉 Adminpanel initialized successfully!');
	//
	// sails.hooks.http.app.use(adminizer.getMiddleware());
	// let layer = sails.hooks.http.app._router.stack.slice(-1)[0]
	// sails.hooks.http.app._router.stack.splice(1, 0, layer)
}


export default async function initialize(sails, cb) {

	// If disabled. Do not load anything
	if (!sails.config.adminpanel) {
		return cb();
	}

	sails.emit('Adminpanel:initialization');

	await HookTools.registerSystemModels();

	sails.on('hook:orm:loaded', async function () {

		const [{Adminizer}, {WaterlineAdapter}] = await Promise.all([
			import('adminizer'),
			import('./SailsORMAdapter.js'),
		]);

		const waterlineAdapter = new WaterlineAdapter(sails.models);

		console.log('⚙️ Creating Adminizer instance...');

		const adminizer = new Adminizer([waterlineAdapter]);

		console.log('🔄 Initializing Adminizer...');

		await adminizer.init(sails.config.adminpanel);

		sails.adminizer = adminizer;

		console.log('🎉 Adminizer initialized successfully!');

		sails.hooks.http.app.use(adminizer.getMiddleware());
		let layer = sails.hooks.http.app._router.stack.slice(-1)[0]
		sails.hooks.http.app._router.stack.splice(1, 0, layer)

		sails.emit('Adminpanel:loaded');

	})

	cb();
}
