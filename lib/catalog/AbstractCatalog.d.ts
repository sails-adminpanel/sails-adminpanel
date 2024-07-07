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
}
export type _Item_ = {
    [key: string]: boolean | string | number | object;
};
/**
 * General Item structure that will be available for all elements, including groups
 *
 *
 */
export declare abstract class BaseItem<T> {
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
    abstract find(itemId: string | number): Promise<T>;
    /**
     * Is false because default value Group is added
     */
    abstract update(itemId: string | number, data: T): Promise<T>;
    abstract create(itemId: string, data: T): Promise<T>;
    /**
     *  delete element
     */
    abstract deleteItem(itemId: string | number): Promise<void>;
    abstract getAddHTML(): {
        type: 'link' | 'html';
        data: string;
    };
    abstract getEditHTML(id: string | number): Promise<{
        type: 'link' | 'html';
        data: string;
    }>;
    abstract getChilds(parentId: string | number | null): Promise<Item[]>;
    abstract search(s: string): Promise<T[]>;
}
export declare abstract class AbstractGroup<T> extends BaseItem<T> {
    readonly type: string;
    readonly isGroup: boolean;
    icon: string;
}
export declare abstract class AbstractItem<T> extends BaseItem<T> {
    readonly isGroup: boolean;
}
export declare abstract class ActionHandler {
    /**
     * Three actions are possible, without configuration, configuration via pop-up, and just external action
     * For the first two, a handler is provided, but the third type of action simply calls the HTML in the popup; the controller will be implemented externally
     * */
    readonly type: "basic" | "external" | "link";
    /**
     * Will be shown in the context menu section
     */
    readonly displayContext: boolean;
    /**
     * Will be shown in the toolbox section
     */
    readonly displayTool: boolean;
    /**
     * For "json-forms" | "external"
     */
    abstract getPopUpHTML(): Promise<string>;
    /**
     * Only for link type
     */
    abstract getLink(): Promise<string>;
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
    abstract handler(items: Item[], config?: any): Promise<void>;
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
     * 0 or null without limits
     */
    abstract readonly maxNestingDepth: number | null;
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
    /**
     * Method for getting childs elements
     * if pass null as parentId this root
     */
    getChilds(parentId: string | number | null, byItemType?: string): Promise<Item[]>;
    protected constructor(items: BaseItem<any>[]);
    setID(id: string): void;
    getItemType(type: string): BaseItem<Item>;
    getGroupType(): BaseItem<Item>;
    additemTypes<T extends BaseItem<any>>(itemType: T): void;
    /**
         *  Removing an element
         */
    find(item: Item): Promise<Item>;
    /**
     *  Removing an element
     */
    deleteItem(item: Item): void;
    /**
     * Receives HTML to update an element for projection into a popup
     */
    getEditHTML(item: Item): void;
    /**
     * Receives HTML to create an element for projection into a popup
     */
    getAddHTML(item: Item): {
        type: "link" | "html";
        data: string;
    };
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
    createItem<T extends Item>(data: T): Promise<T>;
    updateItem<T extends Item>(id: string | number, type: string, data: T): Promise<T>;
    /**
     * Method for getting group elements
     */
    getitemTypes(): BaseItem<Item>[];
    search<T extends Item>(s: string): Promise<T[]>;
    static buildTree(items: Item[]): Item[];
}
