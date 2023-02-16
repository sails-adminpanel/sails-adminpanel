import * as fs from "fs";

export default function migrations(req, res) {
    if (!fs.existsSync(sails.config.adminpanel.migrations.path)) {
        return res.notFound();
    }

    let migrationsLastResult;
    if (fs.existsSync(`${process.cwd()}/.tmp/migrations_run.json`)) {
        migrationsLastResult = require(`${process.cwd()}/.tmp/migrations_run.json`);
    }

    return res.viewAdmin('migrations', { entity: "entity", migrationsInfo: migrationsLastResult });
}
