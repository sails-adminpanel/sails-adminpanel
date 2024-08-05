import { AbstractCatalog } from "./AbstractCatalog";
export declare class CatalogHandler {
    private static catalog;
    static add(catalog: AbstractCatalog): AbstractCatalog;
    static getAll(): AbstractCatalog[];
    static getCatalog(slug: string): AbstractCatalog;
}
