import {HookTools} from "./hookTools.js";
import {SailsORMAdapter} from "./SailsORMAdapter.js";

export default async function initialize(cb) {
	// If admin panel is disabled, don't load anything
	if (!sails.config.adminpanel) {
		return cb();
	}

	// Emit initialization event
	sails.emit('Adminpanel:initialization');

	// Register system models
	await HookTools.registerSystemModels();

	// When ORM is loaded
	sails.on('hook:orm:loaded', async function () {
		// Dynamically import required modules
		const [{Adminizer}, {SailsORMAdapter}, chalk] = await Promise.all([
			import('adminizer'),
			import('./SailsORMAdapter.js'),
			import('chalk')
		]);

		// Create Waterline adapter instance
		const sailsORMAdapter = new SailsORMAdapter(sails.models);
		console.log(chalk.default.cyan('⚙️  Creating Adminizer instance...'));

		// Create Adminizer instance
		const adminizer = new Adminizer([sailsORMAdapter]);
		console.log(chalk.default.cyan('🔄  Initializing Adminizer...'));

		// 1. Start initialization (without waiting for completion yet)
		const initPromise = adminizer.init(sails.config.adminpanel);

		// 2. Subscribe to the loaded event (if it hasn't fired yet)
		const adminizerLoaded = new Promise((resolve) => {
			adminizer.emitter.once('adminizer:loaded', resolve);
		});

		// 3. Wait for both initialization and the event
		await Promise.all([initPromise, adminizerLoaded]);

		console.log(chalk.default.green('✅ Adminizer fully loaded!'));

		// Store Adminizer instance in sails hooks
		sails.hooks.adminpanel.adminizer = adminizer;

		// Configure HTTP middleware
		sails.hooks.http.app.use(adminizer.getMiddleware());
		let layer = sails.hooks.http.app._router.stack.slice(-1)[0];
		sails.hooks.http.app._router.stack.splice(1, 0, layer);

		// 4. Now we can emit the Sails loaded event
		sails.emit('Adminpanel:loaded');
	});

	// Call the callback to continue bootstrapping
	cb();
}
