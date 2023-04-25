import * as fs from "fs";
import * as DBMigrate from 'db-migrate';

export class MigrationsHelper {
    private static queue = [];
    private static migrationsIsRunning = false;

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

    public static async addToProcessMigrationsQueue(migrationsDirectory: string) {
        this.queue.push(migrationsDirectory);
        if (!this.migrationsIsRunning) {
            this.migrationsIsRunning = true;
            let firstToProcess = this.queue.shift();
            await this.processSpecificDirectoryMigrations(firstToProcess, "up", true);
            this.migrationsIsRunning = false;
        } else {
            let timerId = setInterval(async () => {
                if (this.queue.length) {
                    if (!this.migrationsIsRunning) {
                        this.migrationsIsRunning = true;
                        let firstToProcess = this.queue.shift();
                        await this.processSpecificDirectoryMigrations(firstToProcess, "up", true);
                        this.migrationsIsRunning = false;
                    }
                } else {
                    clearInterval(timerId);
                }
            }, 3000)
        }
    }

    public static async processSpecificDirectoryMigrations(migrationsDirectory: string, action: "up" | "down", isInternal = false): Promise<{success: boolean, time: number, message: string}> {
        if (typeof migrationsDirectory === "boolean" || !fs.existsSync(migrationsDirectory)) {
            throw `Migrations path does not exist: ${migrationsDirectory}`
        }

        // !TODO solve migrations down problem described in module-manager
        if (action === "down") {
            throw "Migrations down is not available yet. Please check for updates"
        }

        if (isInternal) {
            let dbmigrate = DBMigrate.getInstance(true, {
                cwd: migrationsDirectory,
                config: {
                    "default": `${sails.config.adminpanel.rootPath}/database.json`
                }
            });

            try {
                await this.runMigrations(dbmigrate, action);
                sails.log.info(`Migrations ${action} was successfully run, path: ${migrationsDirectory}`)
            } catch (e) {
                sails.log.error(`Error trying to run migrations ${action}, path: ${migrationsDirectory}`)
            }
        } else {
            if (typeof sails.config.adminpanel.migrations === "boolean" || !sails.config.adminpanel.migrations.config) {
                throw "Migrations config is not defined"
            }

            let migrationsLastResult;
            if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
                migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
            }

            let migrationsDir = fs.readdirSync(migrationsDirectory);
            if (migrationsDir.length === migrationsLastResult.migrationsCount) {
                return {success: true, time: 0, message: "No unprocessed migrations found, exited without running"};
            } else { // if migrations num changed, run migrations
                let dbmigrate = DBMigrate.getInstance(true, {
                    cwd: migrationsDirectory,
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
}
