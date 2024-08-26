export interface Item {
    id: string;
    parent: string;
    children: Item[];
    mimeType: string;
    path: string;
    size: number;
    image_size: {
        width: number;
        height: number;
        type: string;
    };
    cropType: 'thumb' | string;
    url: string;
    filename: string;
    meta: string;
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
export declare abstract class File<T extends Item> {
    abstract type: "application" | "audio" | "example" | "image" | "message" | "model" | "multipart" | "text" | "video";
    path: string;
    dir: string;
    model: string;
    metaModel: string;
    protected constructor(path: string, dir: string, model: string, metaModel: string);
    /**
     * Upload a file.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    abstract upload(file: UploaderFile, filename: string, origFileName: string, imageSizes?: imageSizes | {}): Promise<T>;
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
     * Create a thumbnail of an item.
     * @param id
     * @param file
     * @param filename
     * @param origFileName
     * @protected
     */
    protected abstract createThumb(id: string, file: UploaderFile, filename: string, origFileName: string): Promise<void>;
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
    abstract uploadCropped(item: Item, file: UploaderFile, fileName: string, config: {
        width: number;
        height: number;
    }): Promise<Item>;
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
    model: string;
    readonly itemTypes: File<Item>[];
    protected constructor(id: string, path: string, dir: string, model: string);
    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    upload(file: UploaderFile, filename: string, origFileName: string, imageSizes?: imageSizes | {}): Promise<Item>;
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
    abstract searchAll(s: string): Promise<Item[]>;
    searchItems(s: string, type: string): Promise<Item[]>;
    /**
     * Get children of an item.
     * @param item
     */
    getChildren(item: Item): Promise<Item[]>;
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    uploadCropped(item: Item, file: UploaderFile, fileName: string, config: {
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
