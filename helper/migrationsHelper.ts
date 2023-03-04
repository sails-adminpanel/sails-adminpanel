import * as fs from "fs";
import * as DBMigrate from 'db-migrate';

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

    private static runMigrations(dbmigrate, action = "up") {
        return new Promise((resolve, reject) => {
            // possible solution for custom migrations without return
            // let runMigrationsTimeout = parseInt(process.env.RUN_MIGRATIONS_TIMEOUT) || 3000;
            // setTimeout(() => reject(`Exited by timeout after ${runMigrationsTimeout}`), runMigrationsTimeout)
            if (action === "up") {
                dbmigrate.up()
                    .then(resolve).catch(reject)
            } else if (action === "down") {
                dbmigrate.down()
                    .then(resolve).catch(reject)
            } else {
                reject("MigrationsHelper: Invalid migration action")
            }
        })
    }

    public static async processMigrations(action): Promise<{success: boolean, time: number, message: string}> {
        if (typeof sails.config.adminpanel.migrations === "boolean" || !fs.existsSync(sails.config.adminpanel.migrations.path)) {
            throw "Migrations config is not defined or migrations path does not exist"
        }

        // !TODO solve migrations down problem described in module-manager
        if (action === "down") {
            throw "Migrations down is not available yet. Please check for updates"
        }

        let migrationsLastResult;
        if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
            migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
        }

        let migrationsDir = fs.readdirSync(sails.config.adminpanel.migrations.path);
        if (migrationsDir.length === migrationsLastResult.migrationsCount) {
            return {success: true, time: 0, message: "No unprocessed migrations found, exited without running"};
        } else { // if migrations num changed, run migrations
            let dbmigrate = DBMigrate.getInstance(true, {
                cwd: sails.config.adminpanel.migrations.path,
                config: {
                    "default": sails.config.adminpanel.migrations.config
                }
            });

            try {
                let startTime = Date.now();
                let result = await this.runMigrations(dbmigrate, action);
                let finishTime = Date.now();
                console.log(`Migrations run result: ${JSON.stringify(result)}`);
                migrationsLastResult = {
                    status: "success",
                    migrationsCount: migrationsDir.length,
                    result: `Migrations ${action} method was run successfully`
                }
                fs.writeFileSync(`${process.cwd()}/.tmp/migrations_run.json`, JSON.stringify(migrationsLastResult, null, 2));
                return {success: true, time: finishTime - startTime, message: `Migrations ${action} method was run successfully`};
            } catch (e) {
                sails.log.error(`Migrations error: ${e}`);
                migrationsLastResult = {
                    status: "failed",
                    migrationsCount: migrationsDir.length,
                    result: `Error while processing migrations ${action} method: ${JSON.stringify(e)}`
                }
                fs.writeFileSync(`${process.cwd()}/.tmp/migrations_run.json`, JSON.stringify(migrationsLastResult, null, 2));
                return {success: false, time: 0, message: `Error while processing migrations ${action} method: ${JSON.stringify(e)}`};
            }
        }
    }
}
