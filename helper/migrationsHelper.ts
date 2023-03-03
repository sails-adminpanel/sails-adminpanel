export default class MigrationsHelper {

    public static processDatastoreAdapter(): void {
        let datastore = sails.getDatastore();

        if (process.env.ENABLE_MIGRATIONS === "true" && sails.config.adminpanel.migrations !== false
            && typeof sails.config.adminpanel.migrations !== "boolean") {
            if (datastore.config.adapter === 'sails-postgresql') {
                sails.config.adminpanel.globalSettings.enableMigrations = true;
                if (!sails.config.adminpanel.migrations.config) {
                    sails.config.adminpanel.migrations.config = datastore.config.url;
                }
            }
        }
    }
}
