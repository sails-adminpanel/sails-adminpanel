export interface Item {
    id: string;
    parent: string;
    variants: Item[];
    mimeType: string;
    path: string;
    size: number;
    /**
     * size: lm | sm | any or locale: en | de | fr
     */
    tag: string;
    group?: string;
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
    abstract upload(file: UploaderFile, filename: string, origFileName: string, group?: string): Promise<T[]>;
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
    }): Promise<void>;
    /**
     * Get children of an item.
     * @param id
     */
    abstract getVariants(id: string): Promise<Item[]>;
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    abstract uploadVariant(item: Item, file: UploaderFile, fileName: string, group?: string, localeId?: string): Promise<Item>;
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
     * @param group
     */
    abstract getItems(limit: number, skip: number, sort: string, group?: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    abstract search(s: string, group?: string): Promise<Item[]>;
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
    private _bindAccessRight;
    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     * @param group
     */
    upload(file: UploaderFile, filename: string, origFileName: string, group?: string): Promise<Item[]>;
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
     * @param group
     * @param sort
     */
    abstract getAll(limit: number, skip: number, sort: string, group?: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    /**
     * Get items of a type.
     * @param type
     * @param limit
     * @param skip
     * @param sort
     * @param group?
     */
    getItems(type: string, limit: number, skip: number, sort: string, group?: string): Promise<{
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
     * Search all items.
     * @param s
     */
    abstract searchAll(s: string, group?: string): Promise<Item[]>;
    /**
     * Search items by type.
     * @param s
     * @param type
     */
    searchItems(s: string, type: string, group?: string): Promise<Item[]>;
    /**
     * Get children of an item.
     * @param item
     */
    getVariants(item: Item): Promise<Item[]>;
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    uploadVariant(item: Item, file: UploaderFile, fileName: string, group?: string, localeId?: string): Promise<Item>;
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
    }): Promise<void>;
    /**
     * Delete an item.
     * @param item
     */
    delete(item: Item): Promise<void>;
}
