import { AbstractCatalog, AbstractGroup, AbstractItem, ActionHandler, Item } from "../../lib/catalog/AbstractCatalog";
interface GroupTestItem extends Item {
    thisIsGroup: boolean;
}
/**
 * Storage takes place in RAM
 */
export declare class StorageService {
    private static storageMap;
    static setElement(id: string | number, item: GroupTestItem | Item): Promise<GroupTestItem | Item>;
    static removeElementById(id: string | number): Promise<void>;
    static findElementById(id: string | number): Promise<GroupTestItem | Item | undefined>;
    static findElementsByParentId(parentId: string | number, type: string): Promise<(GroupTestItem | Item)[]>;
    static getAllElements(): Promise<(GroupTestItem | Item)[]>;
    static search(s: string, type: string): Promise<GroupTestItem[]>;
}
/**
 *
 _____         _    ____
|_   _|__  ___| |_ / ___|_ __ ___  _   _ _ __
  | |/ _ \/ __| __| |  _| '__/ _ \| | | | '_ \
  | |  __/\__ \ |_| |_| | | | (_) | |_| | |_) |
  |_|\___||___/\__|\____|_|  \___/ \__,_| .__/
                                        |_|
 */
export declare class TestGroup extends AbstractGroup<GroupTestItem> {
    name: string;
    allowedRoot: boolean;
    icon: string;
    type: string;
    isGroup: boolean;
    readonly actionHandlers: any[];
    find(itemId: string | number): Promise<GroupTestItem>;
    update(itemId: string | number, data: GroupTestItem): Promise<GroupTestItem>;
    create(itemId: string, data: GroupTestItem): Promise<GroupTestItem>;
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
    search(s: string): Promise<GroupTestItem[]>;
}
/**
 ___ _                 _
|_ _| |_ ___ _ __ ___ / |
 | || __/ _ \ '_ ` _ \| |
 | || ||  __/ | | | | | |
|___|\__\___|_| |_| |_|_|
 */
export declare class Item2 extends AbstractItem<Item> {
    type: string;
    name: string;
    allowedRoot: boolean;
    icon: string;
    readonly actionHandlers: any[];
    getAddHTML(): {
        type: "link" | "html";
        data: string;
    };
    getEditHTML(id: string | number): Promise<{
        type: "link" | "html";
        data: string;
    }>;
    create(itemId: string, data: GroupTestItem): Promise<GroupTestItem>;
    find(itemId: string | number): Promise<Item | GroupTestItem>;
    update(itemId: string | number, data: Item): Promise<Item>;
    deleteItem(itemId: string | number): Promise<void>;
    getChilds(parentId: string | number): Promise<Item[]>;
    search(s: string): Promise<Item[]>;
}
export declare class Page extends AbstractItem<Item> {
    type: string;
    name: string;
    allowedRoot: boolean;
    icon: string;
    readonly actionHandlers: any[];
    find(itemId: string | number): Promise<any>;
    update(itemId: string | number, data: Item): Promise<Item>;
    create(itemId: string, data: Item): Promise<Item>;
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
    search(s: string): Promise<Item[]>;
}
export declare class TestCatalog extends AbstractCatalog {
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
