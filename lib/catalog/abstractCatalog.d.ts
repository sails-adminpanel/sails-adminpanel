/**
 * Interface `Item` describes the data that the UI will operate on
 */
export interface Item {
    id: string | number;
    type: string;
    name: string;
    level: number;
}
export interface NodeModel<TDataType> {
    title: string;
    isLeaf?: boolean;
    children?: NodeModel<TDataType>[];
    ind?: number;
    isExpanded: boolean;
    level: number;
    data?: TDataType;
}
/**
 * General Item structure that will be available for all elements, including groups
 */
export declare abstract class BaseItem implements Item {
    abstract readonly id: string;
    abstract readonly level: number;
    abstract type: string;
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
    /**
     * Is false because default value Group is added
     */
    abstract update<T>(itemId: string | number, data: T): Promise<T>;
    abstract create<T>(itemId: string, data: T): Promise<T>;
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
    abstract getCreatedItems(id: string): Promise<{
        items: {
            id: string;
            title: string;
        }[];
    }>;
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
    readonly type: "basic" | "json-forms" | "external" | "link";
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
    abstract handler(items: (ItemType | GroupType)[], config?: any): Promise<void>;
}
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
    /** Add second panel as instance of class */
    abstract readonly secondPanel: AbstractCatalog | null;
    abstract getCatalog(): Promise<{
        nodes: NodeModel<any>[];
    }>;
    protected constructor(items: BaseItem[]);
    setID(id: string): void;
    getItemType(type: string): GroupType | ItemType;
    addItemsType(itemType: ItemType): void;
    /**
     * Method for change sortion order for group and items
     */
    abstract setSortOrder(data: any): Promise<any>;
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
    handleAction(actionId: string, items?: (ItemType | GroupType)[], config?: any): Promise<void>;
    createItem<T>(item: Item, data: T): Promise<T>;
    updateItem<T>(item: Item, id: string, data: T): Promise<T>;
    /**
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
    getCreatedItems(item: ItemType): Promise<{
        items: {
            id: string;
            title: string;
        }[];
    }>;
    abstract search(s: string): Promise<{
        nodes: NodeModel<any>[];
    }>;
}