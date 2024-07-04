import { AbstractCatalog, Item } from "../../lib/catalog/AbstractCatalog";
export interface NodeData extends Item {
    level: number;
}
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
    getItemType(type: string): import("../../lib/catalog/AbstractCatalog").ItemType | import("../../lib/catalog/AbstractCatalog").GroupType;
    getAddHTML(item: any): {
        type: "link" | "html";
        data: string;
    };
    getItemsType(): (import("../../lib/catalog/AbstractCatalog").ItemType | import("../../lib/catalog/AbstractCatalog").GroupType)[];
    getCatalog(): any;
    createItem(item: any, data: any): Promise<any>;
    getChilds(data: any): Promise<Item[]>;
    getCreatedItems(item: any): any;
    getActions(items: any[]): Promise<import("../../lib/catalog/AbstractCatalog").ActionHandler[]>;
    search(s: string): Promise<Item[]>;
    setSortOrder(data: any): Promise<void>;
    handleAction(actionID: string, items: any[], config: any): Promise<void>;
    updateItem(item: any, id: string, data: any): Promise<Item>;
}
export declare class VueCatalogUtils {
    /**
     * Удаляет лишнее из данных с фронта
     */
    static refinement<T>(): void;
    static toNode<T extends NodeData>(data: T): NodeModel<T>;
}
