export default class MigrationsHelper {

    public static processDatastoreAdapter(): void {
        let datastore = sails.getDatastore();

        if (datastore.config.adapter === 'sails-postgresql') {
            sails.config.adminpanel.globalSettings.enableMigrations = true;
            if (!sails.config.adminpanel.migrations.config) {
                sails.config.adminpanel.migrations.config = datastore.config.url;
            }
        }
    }
}
