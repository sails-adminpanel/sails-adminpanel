// CommonJS entry point для Sails.js
// Динамически загружает ESM модуль

module.exports = function sailsAdminpanel() {
	let libInitialize = require("./lib/initialize.mjs");
    return {
        // Default configuration for the hook
        defaults: function() {
            return {
                adminpanel: {
                    routePrefix: '/admin',
                    auth: false
                }
            };
        },

        // Configure hook
        configure: function() {
            // Configuration logic here
        },
		initialize: async function initialize(cb) {
			await libInitialize.default(cb);
		},
    };
};
