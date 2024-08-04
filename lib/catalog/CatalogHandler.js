"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogHandler = void 0;
class CatalogHandler {
    static add(catalog) {
        this.catalog.push(catalog);
        return catalog;
    }
    static getAll() {
        let catalog = [];
        let config = sails.config.adminpanel;
        if (this.catalog.length) {
            for (const catItem of this.catalog) {
                console.log('catItem: ', catItem);
                catalog.push({
                    id: catItem.id
                });
            }
        }
        return Promise.resolve(catalog);
    }
    static getCatalog(slug) {
        return this.catalog.find((catalog) => catalog.slug === slug);
    }
}
exports.CatalogHandler = CatalogHandler;
CatalogHandler.catalog = [];
