// CommonJS entry point для Sails.js
// Динамически загружает ESM модуль

module.exports = function sailsAdminpanel() {
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

        // Initialize the hook - здесь загружаем ESM
        initialize: async function(cb) {
            try {
                console.log('🔄 Loading adminpanel ESM module...');

                // Динамически импортируем ESM модуль
                const { default: initializeESM } = await import('./lib/11111initialize.mjs');

                // Вызываем ESM инициализацию
                await initializeESM(sails);
                cb();
            } catch (error) {
                console.error('❌ Failed to load adminpanel ESM module:', error);
                cb(error);
            }
        }
    };
};
