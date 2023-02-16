"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const DBMigrate = require("db-migrate");
async function processMigrations(req, res) {
    if (!fs.existsSync(sails.config.adminpanel.migrations.path)) {
        return res.notFound();
    }
    let action = req.query.action;
    if (action !== "up" && action !== "down") {
        return res.badRequest();
    }
    function runMigrations(dbmigrate, action = "up") {
        return new Promise((resolve, reject) => {
            // possible solution for custom migrations without return
            // let runMigrationsTimeout = parseInt(process.env.RUN_MIGRATIONS_TIMEOUT) || 3000;
            // setTimeout(() => reject(`Exited by timeout after ${runMigrationsTimeout}`), runMigrationsTimeout)
            if (action === "up") {
                dbmigrate.up()
                    .then(resolve).catch(reject);
            }
            else if (action === "down") {
                dbmigrate.down()
                    .then(resolve).catch(reject);
            }
            else {
                reject("MigrationsHelper: Invalid migration action");
            }
        });
    }
    let migrationsLastResult;
    if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
        migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
    }
    let migrationsDir = fs.readdirSync(sails.config.adminpanel.migrations.path);
    if (migrationsDir.length === migrationsLastResult.migrationsCount) {
        return res.send({ success: true, time: 0, message: "No unprocessed migrations found, exited without running" });
    }
    else { // if migrations num changed, run migrations
        let dbmigrate = DBMigrate.getInstance(true, {
            cwd: sails.config.adminpanel.migrations.path,
            config: {
                "default": sails.config.datastores.default.url // !TODO check that this will work, sails says "every model in your app uses a datastore named "default"
            }
        });
        try {
            let startTime = Date.now();
            let result = await this.runMigrations(dbmigrate, req.query.action);
            let finishTime = Date.now();
            console.log(`Migrations run result: ${JSON.stringify(result)}`);
            migrationsLastResult = {
                status: "success",
                migrationsCount: migrationsDir.length,
                result: `Migrations ${req.query.action} method was run successfully`
            };
            fs.writeFileSync(`${process.cwd()}/.tmp/migrations_run.json`, JSON.stringify(migrationsLastResult, null, 2));
            return res.send({ success: true, time: finishTime - startTime, message: `Migrations ${req.query.action} method was run successfully` });
        }
        catch (e) {
            sails.log.error(`Migrations error: ${e}`);
            migrationsLastResult = {
                status: "failed",
                migrationsCount: migrationsDir.length,
                result: `Error while processing migrations ${req.query.action} method: ${JSON.stringify(e)}`
            };
            fs.writeFileSync(`${process.cwd()}/.tmp/migrations_run.json`, JSON.stringify(migrationsLastResult, null, 2));
            return res.send({ success: false, time: 0, message: `Error while processing migrations ${req.query.action} method: ${JSON.stringify(e)}` });
        }
    }
}
exports.default = processMigrations;
;
