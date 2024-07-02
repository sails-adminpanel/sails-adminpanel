import { AbstractCatalog, ItemData } from "../../lib/catalog/AbstractCatalog";
export interface NodeModel<TDataType> {
    title: string;
    isLeaf?: boolean;
    children?: NodeModel<TDataType>[];
    /** sortOrder */
    ind?: number;
    isExpanded: boolean;
    level: number;
    data?: TDataType;
}
export declare class VueCatalog {
    catalog: AbstractCatalog;
    constructor(_catalog: AbstractCatalog);
    setID(id: string): void;
    getItemType(type: string): import("../../lib/catalog/AbstractCatalog").GroupType | import("../../lib/catalog/AbstractCatalog").ItemType;
    getAddHTML(item: any): {
        type: "link" | "html";
        data: string;
    };
    getItems(): (import("../../lib/catalog/AbstractCatalog").GroupType | import("../../lib/catalog/AbstractCatalog").ItemType)[];
    getCatalog(): Promise<{
        nodes: import("../../lib/catalog/AbstractCatalog").NodeModel<any>[];
    }>;
    createItem(item: any, data: any): Promise<any>;
    getChilds(data: any): Promise<{
        nodes: import("../../lib/catalog/AbstractCatalog").NodeModel<any>[];
    }>;
    getCreatedItems(item: any): Promise<{
        items: {
            id: string;
            title: string;
        }[];
    }>;
    getActions(items: any[]): Promise<import("../../lib/catalog/AbstractCatalog").ActionHandler[]>;
    search(s: string): Promise<ItemData[]>;
    setSortOrder(data: any): Promise<void>;
    handleAction(actionID: string, items: any[], config: any): Promise<void>;
    updateItem(item: any, id: string, data: any): Promise<ItemData>;
}
export declare class VueCatalogUtils {
    /**
     * Удаляет лишнее из данных с фронта
     */
    static refinement<T>(): void;
    static toNode<T extends ItemData>(data: T): NodeModel<T>;
}
