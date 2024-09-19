import { AccessRightsHelper } from "../../helper/accessRightsHelper";

export interface MediaManagerItem {
    id: string;
    parent: string;
    variants: MediaManagerItem[];
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
    createdAt: number;
    updatedAt: number;
}


type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
  }[keyof T];

export type SortCriteria = `${NumericKeys<MediaManagerItem>} ${"ASC" | "DESC"}`;

export interface MediaManagerWidgetItem {
    id: string;
}

/**
 * This method is for receiving data in the client
 */
export interface MediaManagerWidgetClientItem extends MediaManagerWidgetItem {
    /**
     * need only mimeGroup like Imeage/xxx
     */
    mimeType: string;
    variants: MediaManagerItem[];
    url?: string;
}



export interface MediaManagerWidgetJSON {
    list: MediaManagerWidgetItem[];
    mediaManagerId: string;
}

export interface MediaManagerWidgetData {
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

export abstract class File<T extends MediaManagerItem> {
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
    public abstract getVariants(id: string): Promise<MediaManagerItem[]>;

    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    public abstract uploadVariant(item: MediaManagerItem, file: UploaderFile, fileName: string, group?: string, localeId?: string): Promise<MediaManagerItem>;

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
    public abstract getItems(limit: number, skip: number, sort: SortCriteria, group?: string): Promise<{ data: MediaManagerItem[]; next: boolean }>;

    public abstract search(s: string, group?: string): Promise<MediaManagerItem[]>;

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
    public readonly itemTypes: File<MediaManagerItem>[] = [];

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
    public abstract getAll(limit: number, skip: number, sort: SortCriteria, group?: string): Promise<{ data: MediaManagerItem[]; next: boolean }>;

    /**
     * Get items of a type.
     * @param type
     * @param limit
     * @param skip
     * @param sort
     * @param group?
     */
    public getItems(type: string, limit: number, skip: number, sort: SortCriteria, group?: string): Promise<{ data: MediaManagerItem[]; next: boolean }> {
        return this.getItemType(type)?.getItems(limit, skip, sort, group);
    }

    /**
     * Save Relations.
     * @param data
     * @param model model in which a mediafile connection was added
     * @param modelId Id in the model in which the mediafile was added
     * @param modelAttribute
     */
    public abstract setRelations(
        data: MediaManagerWidgetData, 
        /**
         * widget model in which a mediafile connection was added
         */
        model: string, 
        /** 
         * widget Id in the model in which the mediafile was added
         */
        modelId: string, 
        widgetName: string
    ): Promise<void>;

    public abstract getRelations(items: MediaManagerWidgetItem[],): Promise<MediaManagerWidgetClientItem[]>;

    /**
     * Search all items.
     * @param s
     */
    public abstract searchAll(s: string, group?: string): Promise<MediaManagerItem[]>;

    /**
     * Search items by type.
     * @param s
     * @param type
     */
    public searchItems(s: string, type: string, group?: string): Promise<MediaManagerItem[]> {
        return this.getItemType(type)?.search(s, group);
    }

    /**
     * Get children of an item.
     * @param item
     */
    public getVariants(item: MediaManagerItem): Promise<MediaManagerItem[]> {
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
    public uploadVariant(item: MediaManagerItem, file: UploaderFile, fileName: string, group?: string, localeId?: string): Promise<MediaManagerItem> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.uploadVariant(item, file, fileName, group, localeId);
    }

    /**
     * Get metadata of an item.
     * @param item
     */
    public getMeta(item: MediaManagerItem): Promise<{ key: string; value: string }[]> {
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
    public setMeta(item: MediaManagerItem, data: { [key: string]: string },): Promise<void> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.setMeta(item.id, data);
    }

    /**
     * Delete an item.
     * @param item
     */
    public delete(item: MediaManagerItem): Promise<void> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.delete(item.id);
    }
}
