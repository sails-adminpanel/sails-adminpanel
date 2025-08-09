import { HookTools } from "./hookTools.js";
import { SailsORMAdapter } from "./SailsORMAdapter.js";

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
		const [{ Adminizer }, { SailsORMAdapter }, chalk] = await Promise.all([
			import('adminizer'),
			import('./SailsORMAdapter.js'),
			import('chalk')
		]);

		// Create Waterline adapter instance
		const sailsORMAdapter = new SailsORMAdapter(sails.models);
		console.log(chalk.default.cyan('⚙️  Creating Adminizer instance...'));

		// Create Adminizer instance
		const adminizer = new Adminizer([sailsORMAdapter]);

		// Store Adminizer instance in sails hooks
		sails.hooks.adminpanel.adminizer = adminizer;
		sails.emit('Adminpanel:afterHook:loaded');
		console.log(chalk.default.cyan('🔄  Initializing Adminizer...'));

		// Create proxy for models to track changes
		if (sails.config.adminpanel.models) {
			const createProxyForModels = (target) => {
				return new Proxy(target, {
					set(obj, prop, value) {
						obj[prop] = value;
						console.log(chalk.default.yellow('🔄 Adminpanel models config updated:'), obj);
						return true;
					},
					get(obj, prop) {
						if (typeof obj[prop] === 'object' && obj[prop] !== null && !Array.isArray(obj[prop])) {
							return createProxyForModels(obj[prop]);
						}
						return obj[prop];
					}
				});
			};

			sails.config.adminpanel.models = createProxyForModels(sails.config.adminpanel.models);
			console.log(chalk.default.blue('📋 Initial adminpanel models config:'), sails.config.adminpanel.models);
		}

		// 1. Start initialization (without waiting for completion yet)
		const initPromise = adminizer.init(sails.config.adminpanel);		// 2. Subscribe to the loaded event (if it hasn't fired yet)
		const adminizerLoaded = new Promise((resolve) => {
			adminizer.emitter.once('adminizer:loaded', resolve);
		});

		// 3. Wait for both initialization and the event
		await Promise.all([initPromise, adminizerLoaded]);

		console.log(chalk.default.green('✅ Adminizer fully loaded!'));

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
