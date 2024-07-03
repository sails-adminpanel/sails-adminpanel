/**
 * Interface `Item` describes the data that the UI will operate on
 * This is a common interface for all data that is linked to the catalog
 * This data will also be sent to crud Item
 * */
export interface Item {
    id: string | number;
    name: string;
    parentId: string | number | null;
    childs: Item[];
    sortOrder: number;
    /**
     * is itemType.id
     */
    type: string;
    /**
     * @deprecated level can be find by parnet id
     */
    level: number;
}
export type _Item_ = {
    [key: string]: boolean | string | number | object;
};
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
/**
 * General Item structure that will be available for all elements, including groups
 *
 *
 */
export declare abstract class BaseItem {
    abstract readonly type: string;
    abstract readonly level: number;
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
    abstract readonly actionHandlers: ActionHandler[];
    addActionHandler(contextHandler: ActionHandler): void;
    abstract find<T extends Item>(itemId: string | number): Promise<T & {
        childs: undefined;
    }>;
    /**
     * Is false because default value Group is added
     */
    abstract update<T extends Item>(itemId: string | number, data: T): Promise<T & {
        childs: undefined;
    }>;
    abstract create<T extends Item>(itemId: string, data: T): Promise<T & {
        childs: undefined;
    }>;
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
    /**
     * @deprecated Will it be merged into getChilds? to use one method
     */
    abstract getCreatedItems(id: string): Promise<{
        items: {
            id: string;
            title: string;
        }[];
    }>;
    /**
     *  Set sort value for element
     */
    abstract setSortOrder(id: string | number, sortOrder: number): Promise<void>;
    abstract search(s: string): Promise<(Item & {
        childs: undefined;
    })[]>;
}
export declare abstract class GroupType extends BaseItem {
    readonly isGroup: boolean;
    abstract childs: Item[];
}
export declare abstract class ItemType extends BaseItem {
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
    abstract readonly actionHandlers: ActionHandler[];
    /**
     * icon (url or id)
     */
    abstract readonly icon: string;
    /**
     * List of element types
     */
    readonly itemsType: (ItemType | GroupType)[];
    abstract getCatalog(): Promise<{
        nodes: NodeModel<any>[];
    }>;
    protected constructor(items: (GroupType | ItemType)[]);
    setID(id: string): void;
    getItemType(type: string): GroupType | ItemType;
    addItemsType(itemType: ItemType): void;
    /**
     * Method for change sortion order for group and items
     */
    setSortOrder(item: Item, sortOrder: number): Promise<void>;
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
    updateItem<T extends Item>(id: string, data: T): Promise<T>;
    /**
     * Method for getting group elements
     */
    getItemsType(): (ItemType | GroupType)[];
    /**
     * @deprecated use `getItemsType()`
         * Method for getting group elements
         */
    getItems(): (ItemType | GroupType)[];
    /**
     * Method for getting group childs elements
     * if pass null as parentId this root
     */
    abstract getChilds(data: any): Promise<{
        nodes: NodeModel<any>[];
    }>;
    getCreatedItems(itemTypeId: string): Promise<{
        items: {
            id: string;
            title: string;
        }[];
    }>;
    search(s: string): Promise<Item[]>;
}
