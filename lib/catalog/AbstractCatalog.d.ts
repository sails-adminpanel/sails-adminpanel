import { ActionHandler, ItemType, GroupType, NodeModel, ItemPacket } from "./abstractCatalog";
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
    protected constructor(items: (GroupType | ItemType)[]);
    setID(id: string): void;
    getItemType(type: string): GroupType | ItemType;
    addItemsType(itemType: ItemType): void;
    /**
     * Method for change sortion order for group and items
     */
    setSortOrder(item: ItemPacket, sortOrder: number): Promise<void>;
    /**
     *  Removing an element
     */
    deleteItem(item: ItemPacket): void;
    /**
     * Receives HTML to update an element for projection into a popup
     */
    getEditHTML(item: ItemPacket): void;
    /**
     * Receives HTML to create an element for projection into a popup
     */
    getAddHTML(item: ItemPacket): {
        type: "link" | "html";
        data: string;
    };
    addActionHandler(actionHandler: ActionHandler): void;
    /**
     * Method for getting group elements
     * If there are several Items, then the global ones will be obtained
     */
    getActions(items?: ItemPacket[]): Promise<ActionHandler[]>;
    /**
     * Implements search and execution of a specific action.handler
     */
    handleAction(actionId: string, items?: ItemPacket[], config?: any): Promise<void>;
    createItem<T extends ItemPacket>(data: T): Promise<T>;
    updateItem<T extends ItemPacket>(id: string, data: T): Promise<T & {
        childs: undefined;
    }>;
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
    search(s: string): Promise<ItemPacket[]>;
}
