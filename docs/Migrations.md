# Migrations
Project migrations that can be managed using UI. Adminpanel uses db-migrate library
to manage and run migrations. DB-migrate documentation is available by this [link](https://db-migrate.readthedocs.io/en/latest/).

```javascript
module.exports.adminpanel = {
    migrations: {
        path: string, // path to migrations
        config: string | object // db-migrate config
    } | boolean
};
```

DB-migrate configuration examples is available by this [link](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/configuration/)

To enable/disable you can use:
1. process.env.ENABLE_MIGRATIONS (set `"true"` to enable migrations)
2. global settings (set enableMigrations to `true` like in example below)

```javascript
module.exports.adminpanel = {
    globalSettings: { // Global project settings
        enableMigrations: boolean
    }
};
```
