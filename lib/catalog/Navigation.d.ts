import { AbstractCatalog, AbstractGroup, AbstractItem, Item } from "./AbstractCatalog";
import { NavigationConfig } from "../../interfaces/adminpanelConfig";
interface NavItem extends Item {
    urlPath?: any;
    modelId?: string | number;
}
export declare class Navigation extends AbstractCatalog {
    readonly maxNestingDepth: number | null;
    readonly name: string;
    readonly slug: string;
    readonly icon: string;
    readonly actionHandlers: any[];
    constructor(config: NavigationConfig);
}
export declare class NavigationItem extends AbstractItem<NavItem> {
    readonly allowedRoot: boolean;
    readonly icon: string;
    readonly name: string;
    readonly type: string;
    protected model: string;
    protected navigationModel: string;
    readonly actionHandlers: any[];
    readonly urlPath: any;
    constructor(name: string, model: string, navigationModel: string, urlPath: any);
    create(data: any, catalogId: string): Promise<NavItem>;
    protected dataPreparation(data: any, catalogId: string, sortOrder?: number): Promise<{
        id: any;
        modelId: any;
        name: any;
        parentId: any;
        sortOrder: number;
        icon: string;
        type: string;
        urlPath: any;
    }>;
    updateModelItems(itemId: string | number, data: any, catalogId: string): Promise<NavItem>;
    update(itemId: string | number, data: any, catalogId: string): Promise<NavItem>;
    deleteItem(itemId: string | number, catalogId: string): Promise<void>;
    find(itemId: string | number, catalogId: string): Promise<NavItem>;
    getAddHTML(): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    getChilds(parentId: string | number | null, catalogId: string): Promise<NavItem[]>;
    getEditHTML(id: string | number): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    search(s: string, catalogId: string): Promise<NavItem[]>;
}
export declare class NavigationGroup extends AbstractGroup<NavItem> {
    readonly allowedRoot: boolean;
    readonly name: string;
    readonly groupField: string[];
    constructor(groupField: string[]);
    create(data: any, catalogId: string): Promise<NavItem>;
    protected dataPreparation(data: any, catalogId: string, sortOrder?: number): Promise<{
        id: any;
        name: any;
        parentId: any;
        sortOrder: number;
        icon: string;
        type: string;
    }>;
    deleteItem(itemId: string | number, catalogId: string): Promise<void>;
    find(itemId: string | number, catalogId: string): Promise<NavItem>;
    update(itemId: string | number, data: any, catalogId: string): Promise<NavItem>;
    updateModelItems(itemId: string | number, data: NavItem, catalogId: string): Promise<NavItem>;
    getAddHTML(): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    getChilds(parentId: string | number | null, catalogId: string): Promise<NavItem[]>;
    getEditHTML(id: string | number, catalogId: string): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    search(s: string, catalogId: string): Promise<NavItem[]>;
}
export declare function createTestData(): Promise<void>;
export {};
