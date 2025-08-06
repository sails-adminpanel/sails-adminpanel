import {HookTools} from "./hookTools.js";
import chalk from 'chalk';

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

		console.log(chalk.cyan('⚙️  Creating Adminizer instance...'));

		const adminizer = new Adminizer([waterlineAdapter]);

		console.log(chalk.cyan('🔄  Initializing Adminizer...'));

		await adminizer.init(sails.config.adminpanel);

		sails.adminizer = adminizer;

		console.log(chalk.cyan('🎉  Adminizer initialized successfully!'));

		sails.hooks.http.app.use(adminizer.getMiddleware());
		let layer = sails.hooks.http.app._router.stack.slice(-1)[0]
		sails.hooks.http.app._router.stack.splice(1, 0, layer)

		sails.emit('Adminpanel:loaded');

	})

	cb();
}
