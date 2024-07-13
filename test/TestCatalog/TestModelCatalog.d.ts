import { AbstractCatalog, AbstractItem, ActionHandler, Item } from "../../lib/catalog/AbstractCatalog";
declare class BaseModelItem<T extends Item> extends AbstractItem<T> {
    type: string;
    name: string;
    allowedRoot: boolean;
    icon: string;
    model: string;
    readonly actionHandlers: any[];
    find(itemId: string | number): Promise<any>;
    update(itemId: string | number, data: Item): Promise<T>;
    deleteItem(itemId: string | number): Promise<void>;
    getAddHTML(): {
        type: "link" | "html";
        data: string;
    };
    getEditHTML(id: string | number): Promise<{
        type: "link" | "html";
        data: string;
    }>;
    getChilds(parentId: string | number): Promise<Item[]>;
    search(s: string): Promise<T[]>;
}
export declare class ModelGroup<GroupTestItem extends Item> extends BaseModelItem<GroupTestItem> {
    name: string;
    allowedRoot: boolean;
    icon: string;
    type: string;
    isGroup: boolean;
    model: string;
    readonly actionHandlers: any[];
}
export declare class Page<T extends Item> extends BaseModelItem<T> {
    name: string;
    allowedRoot: boolean;
    icon: string;
    type: string;
    model: string;
    readonly actionHandlers: any[];
}
export declare class TestModelCatalog extends AbstractCatalog {
    readonly name: string;
    readonly slug: string;
    readonly maxNestingDepth: number;
    readonly icon: string;
    readonly actionHandlers: any[];
    constructor();
}
export declare class Link extends ActionHandler {
    readonly icon: string;
    readonly id: string;
    readonly name: string;
    readonly displayTool: boolean;
    readonly displayContext: boolean;
    readonly type = "link";
    readonly selectedItemTypes: string[];
    getLink(): Promise<string>;
    getPopUpHTML(): Promise<string>;
    handler(items: Item[], config?: any): Promise<any>;
}
export declare class ContextAction extends ActionHandler {
    readonly icon: string;
    readonly id: string;
    readonly name: string;
    readonly displayTool: boolean;
    readonly displayContext: boolean;
    readonly type = "basic";
    readonly selectedItemTypes: string[];
    getLink(): Promise<string>;
    getPopUpHTML(): Promise<string>;
    handler(items: Item[], config?: any): Promise<any>;
}
export {};
