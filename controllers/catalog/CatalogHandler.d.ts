import { AbstractCatalog } from "../../lib/catalog/AbstractCatalog";
export declare class CatalogHandler {
    private static catalog;
    static add(catalog: AbstractCatalog): AbstractCatalog;
    static getAll(): Promise<any[]>;
    static getCatalog(slug: string): AbstractCatalog;
}
