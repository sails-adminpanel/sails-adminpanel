"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogHandler = void 0;
class CatalogHandler {
    static add(catalog) {
        this.catalog.push(catalog);
        return catalog;
    }
    static getAll() {
        return this.catalog;
    }
    static getCatalog(slug) {
        return this.catalog.find((catalog) => catalog.slug === slug);
    }
}
exports.CatalogHandler = CatalogHandler;
CatalogHandler.catalog = [];
