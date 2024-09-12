import { AccessRightsHelper } from "../../helper/accessRightsHelper";

export interface Item {
    id: string;
    parent: string;
    variants: Item[];
    // TODO: create versions realization
    // version?: null
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
export type MediaFileType =
    | "application"
    | "audio"
    | "example"
    | "image"
    | "message"
    | "model"
    | "multipart"
    | "text"
    | "video";

export abstract class File<T extends Item> {
    public abstract type: MediaFileType;

    public path: string;
    public dir: string;
    public model: string;
    public metaModel: string;

    // TODO: надо удалить model из конструктора, и metaModel
    protected constructor(path: string, dir: string) {
        this.path = path;
        this.dir = dir;
    }

    /**
     * Upload a file.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    public abstract upload(file: UploaderFile, filename: string, origFileName: string, group?: string): Promise<T[]>;

    /**
     * Get metadata for an item.
     * @param id
     */
    public abstract getMeta(id: string,): Promise<{ key: string; value: string }[]>;

    /**
     * Set metadata for an item.
     * @param id
     * @param data
     */
    public abstract setMeta(id: string, data: { [key: string]: string }): Promise<void>;

    /**
     * Get children of an item.
     * @param id
     */
    public abstract getVariants(id: string): Promise<Item[]>;

    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    public abstract uploadVariant(item: Item, file: UploaderFile, fileName: string, group?: string, localeId?: string): Promise<Item>;

    /**
     * Delete an item.
     * @param id
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Get all items of a type.
     * @param limit
     * @param skip
     * @param sort
     * @param group
     */
    public abstract getItems(limit: number, skip: number, sort: string, group?: string): Promise<{ data: Item[]; next: boolean }>;

    public abstract search(s: string, group?: string): Promise<Item[]>;

    public abstract getOrirgin(id: string): Promise<string>;
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
export abstract class AbstractMediaManager {
    public id: string;
    public path: string;
    public dir: string;
    /**
     * Main model.
     */
    public model: string;
    /**
     * Associations model.
     */
    public modelAssoc: string;
    public readonly itemTypes: File<Item>[] = [];

    /**
     * @param id
     * @param path
     * @param dir
     * @param model
     * @param modelAssoc
     * @protected
     */
    protected constructor(id: string, path: string, dir: string) {
        this.id = id;
        this.path = path;
        this.dir = dir;
        this._bindAccessRight()
    }

    private _bindAccessRight() {
        setTimeout(() => {
            AccessRightsHelper.registerToken({
                id: `mediaManager-${this.id}`,
                name: this.id,
                description: `Access to edit catalog for ${this.id}`,
                department: 'catalog'
            });
        }, 100)
    }

    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     * @param group
     */
    public upload(file: UploaderFile, filename: string, origFileName: string, group?: string) {
        const mimeType = file.type;
        const parts = mimeType.split("/");
        return this.getItemType(parts[0])?.upload(file, filename, origFileName, group);
    }

    /**
     * Get item type.
     * @param type
     * @protected
     */
    protected getItemType(type: string) {
        return this.itemTypes.find((it) => it.type === type);
    }

    /**
     * Get all items.
     * @param limit
     * @param skip
     * @param group
     * @param sort
     */
    public abstract getAll(limit: number, skip: number, sort: string, group?: string): Promise<{ data: Item[]; next: boolean }>;

    /**
     * Get items of a type.
     * @param type
     * @param limit
     * @param skip
     * @param sort
     * @param group?
     */
    public getItems(type: string, limit: number, skip: number, sort: string, group?: string): Promise<{ data: Item[]; next: boolean }> {
        return this.getItemType(type)?.getItems(limit, skip, sort, group);
    }

    /**
     * Save Relations.
     * @param data
     * @param model
     * @param modelId
     * @param modelAttribute
     */
    public abstract saveRelations(data: Data, model: string, modelId: string, widgetName: string,): Promise<void>;

    public abstract getRelations(items: MediaManagerWidgetItem[],): Promise<MediaManagerWidgetItem[]>;

    /**
     * Search all items.
     * @param s
     */
    public abstract searchAll(s: string, group?: string): Promise<Item[]>;

    /**
     * Search items by type.
     * @param s
     * @param type
     */
    public searchItems(s: string, type: string, group?: string): Promise<Item[]> {
        return this.getItemType(type)?.search(s, group);
    }

    /**
     * Get children of an item.
     * @param item
     */
    public getVariants(item: Item): Promise<Item[]> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.getVariants(item.id);
    }

    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    public uploadVariant(item: Item, file: UploaderFile, fileName: string, group?: string, localeId?: string): Promise<Item> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.uploadVariant(item, file, fileName, group, localeId);
    }

    /**
     * Get metadata of an item.
     * @param item
     */
    public getMeta(item: Item): Promise<{ key: string; value: string }[]> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.getMeta(item.id);
    }

    public getOrigin(id: string) {
        return this.getItemType("image")?.getOrirgin(id);
    }

    /**
     *  Set metadata of an item.
     * @param item
     * @param data
     */
    public setMeta(item: Item, data: { [key: string]: string },): Promise<void> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.setMeta(item.id, data);
    }

    /**
     * Delete an item.
     * @param item
     */
    public delete(item: Item): Promise<void> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.delete(item.id);
    }
}
