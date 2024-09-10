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
    // TODO: create versions realization
    // version?: null
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
    public abstract upload(
        file: UploaderFile,
        filename: string,
        origFileName: string,
    ): Promise<T[]>;

    /**
     * Get metadata for an item.
     * @param id
     */
    public abstract getMeta(
        id: string,
    ): Promise<{ key: string; value: string }[]>;

    /**
     * Set metadata for an item.
     * @param id
     * @param data
     */
    public abstract setMeta(
        id: string,
        data: { [key: string]: string },
    ): Promise<{ msg: "success" }>;

    /**
     * Get children of an item.
     * @param id
     */
    public abstract getChildren(id: string): Promise<Item[]>;

    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    public abstract uploadVarinat(item: Item, file: UploaderFile, fileName: string,
        config: {
            width: number;
            height: number;
        },
    ): Promise<Item>;

    public abstract createVariants(file: UploaderFile, parent: Item, filename: string, imageSizes: imageSizes): Promise<void>;

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
     */
    public abstract getItems(
        limit: number,
        skip: number,
        sort: string,
    ): Promise<{ data: Item[]; next: boolean }>;

    public abstract search(s: string): Promise<Item[]>;

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
    }

    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    public upload(file: UploaderFile, filename: string, origFileName: string) {
        const mimeType = file.type;
        const parts = mimeType.split("/");
        return this.getItemType(parts[0])?.upload(file, filename, origFileName);
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
     * @param sort
     */
    public abstract getAll(
        limit: number,
        skip: number,
        sort: string,
    ): Promise<{ data: Item[]; next: boolean }>;

    /**
     * Save Relations.
     * @param data
     * @param model
     * @param modelId
     * @param modelAttribute
     */
    public abstract saveRelations(
        data: Data,
        model: string,
        modelId: string,
        widgetName: string,
    ): Promise<void>;

    public abstract getRelations(
        items: MediaManagerWidgetItem[],
    ): Promise<MediaManagerWidgetItem[]>;

    /**
     * Get items of a type.
     * @param type
     * @param limit
     * @param skip
     * @param sort
     */
    public getItems(
        type: string,
        limit: number,
        skip: number,
        sort: string,
    ): Promise<{ data: Item[]; next: boolean }> {
        return this.getItemType(type)?.getItems(limit, skip, sort);
    }

    /**
     * Search all items.
     * @param s
     */
    public abstract searchAll(s: string): Promise<Item[]>;

    /**
     * Search items by type.
     * @param s
     * @param type
     */
    public searchItems(s: string, type: string): Promise<Item[]> {
        return this.getItemType(type)?.search(s);
    }

    /**
     * Get children of an item.
     * @param item
     */
    public getChildren(item: Item): Promise<Item[]> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.getChildren(item.id);
    }

    public createVariants(
        item: Item,
        file: UploaderFile,
        parent: Item,
        filename: string,
        imageSizes: imageSizes,
    ) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.createVariants(
            file,
            parent,
            filename,
            imageSizes,
        );
    }

    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    public uploadVariant(
        item: Item,
        file: UploaderFile,
        fileName: string,
        config: {
            width: number;
            height: number;
        },
    ): Promise<Item> {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.uploadVarinat(
            item,
            file,
            fileName,
            config,
        );
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
    public setMeta(
        item: Item,
        data: { [key: string]: string },
    ): Promise<{ msg: "success" }> {
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
