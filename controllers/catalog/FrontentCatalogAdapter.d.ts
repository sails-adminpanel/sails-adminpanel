import { AbstractCatalog, Item } from "../../lib/catalog/AbstractCatalog";
interface NodeModel<TDataType> {
    title: string;
    isLeaf: boolean;
    isExpanded: boolean;
    ind: number;
    data?: TDataType;
    children?: NodeModel<TDataType>[];
    isSelected?: boolean;
    isVisible?: boolean;
    isDraggable?: boolean;
    isSelectable?: boolean;
    path?: number[];
    pathStr?: string;
    level?: number;
    isFirstChild?: boolean;
    isLastChild?: boolean;
}
interface NodeData extends Item {
}
interface RequestData {
    reqNode: NodeModel<NodeData>[];
    reqParent: NodeModel<NodeData>;
    _method: string;
}
export declare class VueCatalog {
    catalog: AbstractCatalog;
    constructor(_catalog: AbstractCatalog);
    setID(id: string): void;
    getItemType(type: string): import("../../lib/catalog/AbstractCatalog").BaseItem<Item>;
    getAddHTML(item: any): {
        type: "link" | "html" | "jsonForm";
        data: string;
    };
    getEditHTML(item: any, id: string | number): Promise<{
        type: "link" | "html" | "jsonForm";
        data: string;
    }>;
    getitemTypes(): import("../../lib/catalog/AbstractCatalog").BaseItem<Item>[];
    getActions(items: NodeModel<any>[], type: string): Promise<import("../../lib/catalog/AbstractCatalog").ActionHandler[]>;
    handleAction(actionId: string, items: any[], config: any): Promise<void>;
    getPopUpHTML(actionId: string): Promise<string>;
    getLink(actionId: string): Promise<string>;
    getCatalog(): Promise<NodeModel<Item>[]>;
    createItem(data: any): Promise<any>;
    getChilds(data: any): Promise<NodeModel<Item>[]>;
    search(s: string): Promise<NodeModel<Item>[]>;
    updateTree(data: RequestData): Promise<any>;
    updateItem(item: any, id: string, data: any): Promise<any>;
    deleteItem(items: NodeModel<any>[]): Promise<{
        ok: boolean;
    }>;
}
export declare class VueCatalogUtils {
    /**
     * Removes unnecessary data from the front
     */
    static refinement<T extends NodeModel<any>>(nodeModel: T): any;
    static arrayToNode<T extends Item>(items: T[], groupTypeName: string): NodeModel<T>[];
    static toNode<T extends NodeData>(data: T, groupTypeName: string): NodeModel<T>;
    static expandTo<T extends NodeData>(vueCatalogData: NodeModel<T>, theseItemIdsNeedToBeOpened: (string | number)[]): NodeModel<T>;
    static treeToNode(tree: Item[], groupTypeName: string): NodeModel<Item>[];
}
export {};
