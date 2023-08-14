import * as fs from "fs";
import * as DBMigrate from 'db-migrate';

export class MigrationsHelper {
    private static queue = [];
    private static migrationsIsRunning = false;

    public static processDatastoreAdapter(): void {
        if (process.env.ENABLE_MIGRATIONS === "true" && sails.config.adminpanel.migrations !== false && typeof sails.config.adminpanel.migrations !== "boolean") {
                let datastore = sails.getDatastore();
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

    public static async addToProcessMigrationsQueue(migrationsDirectory: string, action: "up" | "down") {
        if (typeof migrationsDirectory === "boolean" || !fs.existsSync(migrationsDirectory)) {
            throw `Migrations path does not exist: ${migrationsDirectory}`
        }

        if (!fs.readdirSync(migrationsDirectory).length) {
            throw `Migrations directory is empty: ${migrationsDirectory}`
        }

        this.queue.push({directory: migrationsDirectory, action: action});
        await this.runMigrationsQueue();
    }

    private static async runMigrationsQueue() {
        if (this.queue.length) {
            if (!this.migrationsIsRunning) {
                let firstToProcess = this.queue.shift();
                await this.processSpecificDirectoryMigrations(firstToProcess.directory, firstToProcess.action);
                await this.runMigrationsQueue();
            }
        }
    }

    public static async processSpecificDirectoryMigrations(migrationsDirectory: string, action: "up" | "down"): Promise<void> {
        this.migrationsIsRunning = true;

        if (typeof sails.config.adminpanel.migrations === "boolean" || !sails.config.adminpanel.migrations.config) {
            throw "Migrations config is not defined";
        }

        // !TODO solve migrations down problem described in module-manager
        if (action === "down") {
            throw "Migrations down is not available yet. Please check for updates"
        }

        let dbmigrate = DBMigrate.getInstance(true, {
            cwd: migrationsDirectory,
            config: sails.config.adminpanel.migrations.config
        });

        try {
            await this.runMigrations(dbmigrate, action);
            sails.log.info(`Migrations ${action} was successfully run, path: ${migrationsDirectory}`)
        } catch (e) {
            throw `Error trying to run migrations ${action}, path: ${migrationsDirectory}`
        }
        this.migrationsIsRunning = false;
    }
}