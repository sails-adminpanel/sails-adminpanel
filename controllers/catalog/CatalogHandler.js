"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogHandler = void 0;
class CatalogHandler {
    static add(catalog) {
        this.catalog.push(catalog);
    }
    static getAll(user) {
        let catalog = [];
        let config = sails.config.adminpanel;
        if (this.catalog.length) {
            for (const catItem of this.catalog) {
                catalog.push({
                    api: `${config.routePrefix}/catalog/${catItem.slug}`,
                });
            }
        }
        return Promise.resolve(catalog);
    }
}
exports.CatalogHandler = CatalogHandler;
CatalogHandler.catalog = [];
