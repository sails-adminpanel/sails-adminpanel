import { AbstractCatalog, AbstractItem, ActionHandler, Item } from "../../lib/catalog/AbstractCatalog";
import { JSONSchema4 } from "json-schema";
declare class BaseModelItem<T extends Item> extends AbstractItem<T> {
    type: string;
    name: string;
    allowedRoot: boolean;
    icon: string;
    model: string;
    readonly actionHandlers: ActionHandler[];
    find(itemId: string | number): Promise<any>;
    update(itemId: string | number, data: Item): Promise<T>;
    create(catalogId: string, data: T): Promise<T>;
    deleteItem(itemId: string | number): Promise<void>;
    getAddHTML(): Promise<{
        type: "link" | "html";
        data: string;
    }>;
    getEditHTML(id: string | number, parenId?: string | number): Promise<{
        type: "link" | "html";
        data: string;
    }>;
    getChilds(parentId: string | number): Promise<Item[]>;
    search(s: string): Promise<T[]>;
    updateModelItems(itemId: string | number, data: T, catalogId: string): Promise<T>;
}
export declare class ModelGroup<GroupTestItem extends Item> extends BaseModelItem<GroupTestItem> {
    name: string;
    allowedRoot: boolean;
    icon: string;
    type: string;
    isGroup: boolean;
    model: string;
    readonly actionHandlers: ActionHandler[];
}
export declare class Page<T extends Item> extends BaseModelItem<T> {
    name: string;
    allowedRoot: boolean;
    icon: string;
    type: string;
    model: string;
    readonly actionHandlers: ActionHandler[];
}
export declare class ItemHTML extends AbstractItem<Item> {
    readonly allowedRoot: boolean;
    name: string;
    icon: string;
    type: string;
    readonly actionHandlers: ActionHandler[];
    getAddHTML(): Promise<{
        type: 'link' | 'html' | 'jsonForm';
        data: string;
    }>;
    getEditHTML(id: string | number): Promise<{
        type: 'link' | 'html' | 'jsonForm';
        data: string;
    }>;
    create(itemId: string, data: Item): Promise<Item>;
    find(itemId: string | number): Promise<Item>;
    update(itemId: string | number, data: Item): Promise<Item>;
    deleteItem(itemId: string | number): Promise<void>;
    getChilds(parentId: string | number): Promise<Item[]>;
    search(s: string): Promise<Item[]>;
    updateModelItems(itemId: string | number, data: Item, catalogId: string): Promise<Item>;
}
export declare class ItemJsonForm extends ItemHTML {
    readonly allowedRoot: boolean;
    name: string;
    icon: string;
    type: string;
    getAddHTML(): Promise<any>;
    getEditHTML(id: string | number): Promise<{
        type: 'link' | 'html' | 'jsonForm';
        data: string;
    }>;
}
export declare class TestModelCatalog extends AbstractCatalog {
    readonly name: string;
    readonly slug: string;
    readonly maxNestingDepth: number;
    readonly icon: string;
    readonly actionHandlers: ActionHandler[];
    constructor();
    readonly movingGroupsRootOnly: boolean;
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
    handler(items: Item[], data?: any): Promise<any>;
    readonly jsonSchema: JSONSchema4;
    readonly uiSchema: any;
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
    handler(items: Item[], data?: any): Promise<any>;
    readonly jsonSchema: JSONSchema4;
    readonly uiSchema: any;
}
export declare class HTMLAction extends ActionHandler {
    readonly icon: string;
    readonly id: string;
    readonly name: string;
    readonly jsonSchema: JSONSchema4;
    readonly uiSchema: any;
    readonly displayTool: boolean;
    readonly displayContext: boolean;
    readonly type = "external";
    readonly selectedItemTypes: string[];
    getLink(): Promise<string>;
    getPopUpHTML(): Promise<string>;
    handler(items: Item[], data?: any): Promise<any>;
}
export declare class JsonFormAction extends ActionHandler {
    readonly icon: string;
    readonly id: string;
    readonly jsonSchema: JSONSchema4;
    readonly name: string;
    readonly uiSchema: any;
    readonly displayTool: boolean;
    readonly displayContext: boolean;
    readonly selectedItemTypes: string[];
    readonly type: "basic" | "json-forms" | "external" | "link";
    getLink(): Promise<string>;
    getPopUpHTML(): Promise<string>;
    handler(items: Item[], data?: any): Promise<any>;
}
export {};
