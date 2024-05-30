import UserAP from "../../models/UserAP";
type CatalogType = {
    slug: string;
};
export declare class CatalogHandler {
    private static catalog;
    static add(catalog: CatalogType): void;
    static getAll(user: UserAP): Promise<any[]>;
}
export {};
