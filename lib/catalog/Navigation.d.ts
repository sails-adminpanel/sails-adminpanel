import { AbstractCatalog, ActionHandler, Item } from "./AbstractCatalog";
import { NavigationConfig } from "../../../interfaces/adminpanelConfig";
export interface NavItem extends Item {
    urlPath?: any;
    modelId?: string | number;
    targetBlank?: boolean;
}
declare class StorageService {
    protected storageMap: Map<string | number, NavItem>;
    protected id: string;
    protected model: string;
    constructor(id: string, model: string);
    protected initModel(): void;
    getId(): string;
    buildTree(): Promise<any>;
    populateFromTree(tree: any[]): Promise<void>;
    setElement(id: string | number, item: NavItem): Promise<NavItem>;
    removeElementById(id: string | number): Promise<void>;
    findElementById(id: string | number): Promise<NavItem | undefined>;
    findElementByModelId(modelId: string | number): Promise<NavItem[] | undefined>;
    saveToDB(): Promise<void>;
    findElementsByParentId(parentId: string | number, type: string | null): Promise<NavItem[]>;
    getAllElements(): Promise<NavItem[]>;
    search(s: string, type: string): Promise<NavItem[]>;
}
export declare class StorageServices {
    protected static storages: StorageService[];
    static add(storage: StorageService): void;
    static get(id: string): StorageService;
    static getAll(): StorageService[];
}
export declare class Navigation extends AbstractCatalog {
    readonly movingGroupsRootOnly: boolean;
    readonly name: string;
    readonly slug: string;
    readonly icon: string;
    readonly actionHandlers: ActionHandler[];
    idList: string[];
    constructor(config: NavigationConfig);
    getIdList(): Promise<string[]>;
}
export {};
