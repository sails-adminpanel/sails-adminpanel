"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function migrations(req, res) {
    console.log("Migrations", sails.config.adminpanel.migrations.path);
    if (!fs.existsSync(sails.config.adminpanel.migrations.path)) {
        return res.notFound();
    }
    let migrationsLastResult;
    if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
        migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
    }
    return res.viewAdmin('migrations', { entity: "entity", migrationsInfo: migrationsLastResult });
}
exports.default = migrations;
