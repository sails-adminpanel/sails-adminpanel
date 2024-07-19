import { AbstractCatalog, AbstractItem, Item } from "./AbstractCatalog";
import { NavigationConfig } from "../../interfaces/adminpanelConfig";
export declare class Navigation extends AbstractCatalog {
    readonly maxNestingDepth: number | null;
    readonly name: string;
    readonly slug: string;
    readonly icon: string;
    readonly actionHandlers: any[];
    constructor(config: NavigationConfig);
}
export declare class NavigationItem<T extends Item> extends AbstractItem<T> {
    readonly allowedRoot: boolean;
    readonly icon: string;
    readonly name: string;
    readonly type: string;
    protected model: string;
    protected navigationModel: string;
    readonly actionHandlers: any[];
    constructor(name: string, model: string, navigationModel: string);
    find(itemId: string | number): Promise<T>;
    create(catalogId: string, data: T): Promise<T>;
    deleteItem(itemId: string | number): Promise<void>;
    getAddHTML(): {
        type: "link" | "html" | "jsonForm";
        data: string;
    };
    getChilds(parentId: string | number | null): Promise<Item[]>;
    getEditHTML(id: string | number): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    search(s: string): Promise<T[]>;
    update(itemId: string | number, data: T): Promise<T>;
}
export declare class NavigationGroup<T extends Item> extends NavigationItem<T> {
    readonly icon: string;
    isGroup: boolean;
    constructor(name: string, model: string, navigationModel: string);
}
