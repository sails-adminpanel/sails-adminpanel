import { AbstractCatalog, AbstractGroup, AbstractItem, Item } from "./AbstractCatalog";
import { NavigationConfig } from "../../interfaces/adminpanelConfig";
export declare class Navigation extends AbstractCatalog {
    readonly maxNestingDepth: number | null;
    readonly name: string;
    readonly slug: string;
    readonly icon: string;
    readonly actionHandlers: any[];
    constructor(config: NavigationConfig);
}
export declare class NavigationItem extends AbstractItem<Item> {
    readonly allowedRoot: boolean;
    readonly icon: string;
    readonly name: string;
    readonly type: string;
    protected model: string;
    protected navigationModel: string;
    readonly actionHandlers: any[];
    readonly urlPath: any;
    constructor(name: string, model: string, navigationModel: string, urlPath: any);
    create(data: any, catalogId: string): Promise<Item>;
    deleteItem(itemId: string | number, catalogId: string): Promise<void>;
    find(itemId: string | number, catalogId: string): Promise<Item>;
    getAddHTML(): {
        type: "link" | "html" | "jsonForm";
        data: string;
    };
    getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]>;
    getEditHTML(id: string | number): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    search(s: string, catalogId: string): Promise<Item[]>;
    update(itemId: string | number, data: any, catalogId: string): Promise<Item>;
}
export declare class NavigationGroup extends AbstractGroup<Item> {
    readonly allowedRoot: boolean;
    readonly name: string;
    readonly groupField: string[];
    constructor(groupField: string[]);
    create(data: any, catalogId: string): Promise<Item>;
    deleteItem(itemId: string | number, catalogId: string): Promise<void>;
    find(itemId: string | number, catalogId: string): Promise<Item>;
    getAddHTML(): {
        type: "link" | "html" | "jsonForm";
        data: string;
    };
    getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]>;
    getEditHTML(id: string | number): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    search(s: string, catalogId: string): Promise<Item[]>;
    update(itemId: string | number, data: any, catalogId: string): Promise<Item>;
}
