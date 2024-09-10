export interface Item {
    id: string;
    /**
     * it's mean version of the item
     */
    parent: string;
    /**
     * it's mean version
     */
    children: Item[];
    mimeType: string;
    path: string;
    size: number;
    image_size: {
        width: number;
        height: number;
        type: string;
    };
    cropType: "thumb" | string;
    url: string;
    filename: string;
    meta: string[];
}
export interface MediaManagerWidgetItem {
    id: string;
}
export interface MediaManagerWidgetJSON {
    list: MediaManagerWidgetItem[];
    mediaManagerId: string;
}
export interface Data {
    list: MediaManagerWidgetItem[];
    mediaManagerId: string;
}
export interface UploaderFile {
    fd: string;
    size: number;
    type: string;
    filename: string;
    status: string;
    field: string;
    extra: string | undefined;
}
export interface imageSizes {
    [key: string]: {
        width: number;
        height: number;
    };
}
export type MediaFileType = "application" | "audio" | "example" | "image" | "message" | "model" | "multipart" | "text" | "video";
export declare abstract class File<T extends Item> {
    abstract type: MediaFileType;
    path: string;
    dir: string;
    model: string;
    metaModel: string;
    protected constructor(path: string, dir: string);
    /**
     * Upload a file.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    abstract upload(file: UploaderFile, filename: string, origFileName: string): Promise<T[]>;
    /**
     * Get metadata for an item.
     * @param id
     */
    abstract getMeta(id: string): Promise<{
        key: string;
        value: string;
    }[]>;
    /**
     * Set metadata for an item.
     * @param id
     * @param data
     */
    abstract setMeta(id: string, data: {
        [key: string]: string;
    }): Promise<{
        msg: "success";
    }>;
    /**
     * Get children of an item.
     * @param id
     */
    abstract getChildren(id: string): Promise<Item[]>;
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    abstract uploadVarinat(item: Item, file: UploaderFile, fileName: string, config: {
        width: number;
        height: number;
    }): Promise<Item>;
    abstract createVariants(file: UploaderFile, parent: Item, filename: string, imageSizes: imageSizes): Promise<void>;
    /**
     * Delete an item.
     * @param id
     */
    abstract delete(id: string): Promise<void>;
    /**
     * Get all items of a type.
     * @param limit
     * @param skip
     * @param sort
     */
    abstract getItems(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    abstract search(s: string): Promise<Item[]>;
    abstract getOrirgin(id: string): Promise<string>;
}
/**
 *
 * ░█████╗░██████╗░░██████╗████████╗██████╗░░█████╗░░█████╗░████████╗
 * ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝
 * ███████║██████╦╝╚█████╗░░░░██║░░░██████╔╝███████║██║░░╚═╝░░░██║░░░
 * ██╔══██║██╔══██╗░╚═══██╗░░░██║░░░██╔══██╗██╔══██║██║░░██╗░░░██║░░░
 * ██║░░██║██████╦╝██████╔╝░░░██║░░░██║░░██║██║░░██║╚█████╔╝░░░██║░░░
 * ╚═╝░░╚═╝╚═════╝░╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░
 *
 * ███╗░░░███╗███████╗██████╗░██╗░█████╗░███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗██████╗░
 * ████╗░████║██╔════╝██╔══██╗██║██╔══██╗████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝██╔══██╗
 * ██╔████╔██║█████╗░░██║░░██║██║███████║██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██████╔╝
 * ██║╚██╔╝██║██╔══╝░░██║░░██║██║██╔══██║██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██╔══██╗
 * ██║░╚═╝░██║███████╗██████╔╝██║██║░░██║██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░░██║
 * ╚═╝░░░░░╚═╝╚══════╝╚═════╝░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚═╝
 */
export declare abstract class AbstractMediaManager {
    id: string;
    path: string;
    dir: string;
    /**
     * Main model.
     */
    model: string;
    /**
     * Associations model.
     */
    modelAssoc: string;
    readonly itemTypes: File<Item>[];
    /**
     * @param id
     * @param path
     * @param dir
     * @param model
     * @param modelAssoc
     * @protected
     */
    protected constructor(id: string, path: string, dir: string);
    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    upload(file: UploaderFile, filename: string, origFileName: string): Promise<Item[]>;
    /**
     * Get item type.
     * @param type
     * @protected
     */
    protected getItemType(type: string): File<Item>;
    /**
     * Get all items.
     * @param limit
     * @param skip
     * @param sort
     */
    abstract getAll(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    /**
     * Save Relations.
     * @param data
     * @param model
     * @param modelId
     * @param modelAttribute
     */
    abstract saveRelations(data: Data, model: string, modelId: string, widgetName: string): Promise<void>;
    abstract getRelations(items: MediaManagerWidgetItem[]): Promise<MediaManagerWidgetItem[]>;
    /**
     * Get items of a type.
     * @param type
     * @param limit
     * @param skip
     * @param sort
     */
    getItems(type: string, limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    /**
     * Search all items.
     * @param s
     */
    abstract searchAll(s: string): Promise<Item[]>;
    /**
     * Search items by type.
     * @param s
     * @param type
     */
    searchItems(s: string, type: string): Promise<Item[]>;
    /**
     * Get children of an item.
     * @param item
     */
    getChildren(item: Item): Promise<Item[]>;
    createVariants(item: Item, file: UploaderFile, parent: Item, filename: string, imageSizes: imageSizes): Promise<void>;
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    uploadVariant(item: Item, file: UploaderFile, fileName: string, config: {
        width: number;
        height: number;
    }): Promise<Item>;
    /**
     * Get metadata of an item.
     * @param item
     */
    getMeta(item: Item): Promise<{
        key: string;
        value: string;
    }[]>;
    getOrigin(id: string): Promise<string>;
    /**
     *  Set metadata of an item.
     * @param item
     * @param data
     */
    setMeta(item: Item, data: {
        [key: string]: string;
    }): Promise<{
        msg: "success";
    }>;
    /**
     * Delete an item.
     * @param item
     */
    delete(item: Item): Promise<void>;
}
