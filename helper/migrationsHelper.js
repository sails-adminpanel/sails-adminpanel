"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MigrationsHelper {
    static processDatastoreAdapter() {
        let datastore = sails.getDatastore();
        if (sails.config.adminpanel.migrations !== false && typeof sails.config.adminpanel.migrations !== "boolean") {
            if (datastore.config.adapter === 'sails-postgresql') {
                sails.config.adminpanel.globalSettings.enableMigrations = true;
                if (!sails.config.adminpanel.migrations.config) {
                    sails.config.adminpanel.migrations.config = datastore.config.url;
                }
            }
        }
    }
}
exports.default = MigrationsHelper;
