import { JSONSchema4 } from "json-schema";
/**
 * Interface `Item` describes the data that the UI will operate on
 * This is a common interface for all data that is linked to the catalog
 * This data will also be sent to crud Item
 * */
export interface Item {
    id: string | number;
    name: string;
    parentId: string | number | null;
    childs?: Item[];
    sortOrder: number;
    icon: string;
    type: string;
    marked?: boolean;
}
export type _Item_ = {
    [key: string]: boolean | string | number | object;
};
/**
 * General Item structure that will be available for all elements, including groups
 *
 *
 */
export declare abstract class BaseItem<T extends Item> {
    abstract readonly type: string;
    /**
     * Used for infer T
     * I haven't found an easier way to extract this type that goes into generic
     * If you know how to open PR
     * */
    /**
     * Catalog name
     */
    abstract readonly name: string;
    /**
     * A sign that this is a group
     */
    abstract readonly isGroup: boolean;
    /**
     * Is it allowed or not to add an element to the root
     */
    abstract readonly allowedRoot: boolean;
    /**
     *  icon (url or id)
     */
    abstract readonly icon: string;
    /**
     * Array of all global contexts, which will appear for all elements
     */
    readonly actionHandlers: ActionHandler[];
    addActionHandler(contextHandler: ActionHandler): void;
    /**
     * Adds the required fields
     * @param item
     */
    _enrich(item: T): void;
    _find(itemId: string | number, catalogId: string): Promise<T>;
    abstract find(itemId: string | number, catalogId: string): Promise<T>;
    /**
     * Is false because default value Group is added
     */
    abstract update(itemId: string | number, data: T, catalogId: string): Promise<T>;
    /**
     *
     * @param itemId
     * @param data
     * @param catalogId
     */
    abstract updateModelItems(modelId: string | number, data: any, catalogId: string): Promise<T>;
    /**
     * For custom HTML
     * @param itemId
     * @param data
     */
    abstract create(data: T, catalogId: string): Promise<T>;
    /**
     *  delete element
     */
    abstract deleteItem(itemId: string | number, catalogId: string): Promise<void>;
    abstract getAddHTML(loc: string): Promise<{
        type: 'link' | 'html' | 'jsonForm';
        data: string;
    }>;
    abstract getEditHTML(id: string | number, catalogId: string, loc: string, modelId?: string | number): Promise<{
        type: 'link' | 'html' | 'jsonForm';
        data: string;
    }>;
    _getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]>;
    abstract getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]>;
    abstract search(s: string, catalogId: string): Promise<T[]>;
}
export declare abstract class AbstractGroup<T extends Item> extends BaseItem<T> {
    readonly type: string;
    readonly isGroup: boolean;
    icon: string;
}
export declare abstract class AbstractItem<T extends Item> extends BaseItem<T> {
    readonly isGroup: boolean;
}
export declare abstract class ActionHandler {
    /**
     * Three actions are possible, without configuration, configuration via pop-up, and just external action
     * For the first two, a handler is provided, but the third type of action simply calls the HTML in the popup; the controller will be implemented externally
     * */
    abstract readonly type: "basic" | "json-forms" | "external" | "link" | "partial";
    /**
     * Will be shown in the context menu section
     */
    abstract readonly displayContext: boolean;
    /**
     * Will be shown in the toolbox section
     */
    abstract readonly displayTool: boolean;
    /** (!*1)
     * Only for json-forms
     * ref: https://jsonforms.io/docs
     */
    abstract readonly uiSchema: any;
    abstract readonly jsonSchema: JSONSchema4;
    /**
     * For "json-forms" | "external"
     */
    abstract getPopUpHTML(data?: any): Promise<string>;
    /**
     * Only for link type
     */
    abstract getLink(data?: any): Promise<string>;
    /**
     * For which elements the action can be used
     */
    readonly selectedItemTypes: string[];
    /**
     * icon (url or id)
     */
    abstract readonly id: string;
    abstract readonly icon: string;
    abstract readonly name: string;
    /**
     * Implementation of a method that will do something with elements.
     * there's really not much you can do with the context menu
     * @param items
     * @param config
     */
    abstract handler(items: Item[], data?: any): Promise<void>;
}
/**
 *
    Abstract
   ____    _  _____  _    _     ___   ____
  / ___|  / \|_   _|/ \  | |   / _ \ / ___|
 | |     / _ \ | | / _ \ | |  | | | | |  _
 | |___ / ___ \| |/ ___ \| |__| |_| | |_| |
  \____/_/   \_|_/_/   \_|_____\___/ \____|


 */
export declare abstract class AbstractCatalog {
    /**
     * id for catalog please use id format
     *
     *    */
    id: string;
    /**
     * Catalog name
     */
    abstract readonly name: string;
    /**
     * Catalog slug
     */
    abstract readonly slug: string;
    /**
     * moving groups to the root only
     */
    movingGroupsRootOnly: boolean;
    /**
     * Array of all global contexts, which will appear for all elements
     */
    readonly actionHandlers: ActionHandler[];
    /**
     * icon (url or id)
     */
    abstract readonly icon: string;
    /**
     * List of element types
     */
    readonly itemTypes: BaseItem<Item>[];
    getLocalizeMessages(): object;
    /**
     * Method for getting childs elements
     * if pass null as parentId this root
     */
    getChilds(parentId: string | number | null, byItemType?: string): Promise<Item[]>;
    private _bindAccessRight;
    protected constructor(items: BaseItem<any>[]);
    setID(id: string): void;
    /**
     * Gettind id list method
     */
    getIdList(): Promise<string[]>;
    getItemType(type: string): BaseItem<Item>;
    getGroupType(): BaseItem<Item>;
    additemTypes<T extends BaseItem<any>>(itemType: T): void;
    /**
     *  Get an element
     */
    find(item: Item): Promise<Item>;
    /**
     *  Removing an element
     */
    deleteItem(type: string, id: string | number): void;
    /**
     * Receives HTML to update an element for projection into a popup
     */
    getEditHTML(item: Item, id: string | number, loc: string, modelId?: string | number): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    /**
     * Receives HTML to create an element for projection into a popup
     */
    getAddHTML(item: Item, loc: string): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    addActionHandler(actionHandler: ActionHandler): void;
    /**
     * Method for getting group elements
     * If there are several Items, then the global ones will be obtained
     */
    getActions(items?: Item[]): Promise<ActionHandler[]>;
    /**
     * Implements search and execution of a specific action.handler
     */
    handleAction(actionId: string, items?: Item[], config?: any): Promise<void>;
    /**
     * Only For a Link action
     * @param actionId
     */
    getLink(actionId: string): Promise<string>;
    /**
     * For Extermal and JsonForms actions
     * @param actionId
     */
    getPopUpHTML(actionId: string): Promise<string>;
    /**
     *
     * @param data
     */
    createItem<T extends Item>(data: T): Promise<T>;
    updateItem<T extends Item>(id: string | number, type: string, data: T): Promise<T>;
    /**
     * To update all items in the tree after updating the model
     * @param id
     * @param type
     * @param data
     */
    updateModelItems<T extends Item>(modelId: string | number, type: string, data: T): Promise<T>;
    /**
     * Method for getting group elements
     */
    getitemTypes(): BaseItem<Item>[];
    search<T extends Item>(s: string, hasExtras?: boolean): Promise<T[]>;
    static buildTree(items: Item[]): Item[];
}
