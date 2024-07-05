import { AbstractCatalog, Item } from "../../lib/catalog/AbstractCatalog";
export interface NodeData extends Item {
}
export interface NodeModel<TDataType> {
    title: string;
    isLeaf?: boolean;
    children?: NodeModel<TDataType>[];
    /** sortOrder */
    ind?: number;
    isExpanded: boolean;
    data?: TDataType;
}
export declare class VueCatalog {
    catalog: AbstractCatalog;
    constructor(_catalog: AbstractCatalog);
    setID(id: string): void;
    getItemType(type: string): import("../../lib/catalog/AbstractCatalog").BaseItem<Item>;
    getAddHTML(item: any): {
        type: "link" | "html";
        data: string;
    };
    getitemTypes(): import("../../lib/catalog/AbstractCatalog").BaseItem<Item>[];
    getActions(items: any[]): Promise<import("../../lib/catalog/AbstractCatalog").ActionHandler[]>;
    handleAction(actionID: string, items: any[], config: any): Promise<void>;
    getCatalog(): Promise<void>;
    createItem(data: any): Promise<any>;
    getChilds(data: any): Promise<Item[]>;
    getCreatedItems(data: any): Promise<Item[]>;
    search(s: string): Promise<Item[]>;
    setSortOrder(data: any): Promise<void>;
    updateItem(item: any, id: string, data: any): Promise<any>;
}
export declare class VueCatalogUtils {
    /**
     * Removes unnecessary data from the front
     */
    static refinement<T extends NodeModel<any>>(nodeModel: T): any;
    static arrayToNode<T extends Item>(items: T[]): NodeModel<T>[];
    static toNode<T extends NodeData>(data: T): NodeModel<T>;
}
