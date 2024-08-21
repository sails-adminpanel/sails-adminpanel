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
     *
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    abstract upload(file: UploaderFile, filename: string, origFileName: string, imageSizes?: imageSizes | {}): Promise<T>;
    /**
     *
     * @param id
     */
    abstract getMeta(id: string): Promise<{
        key: string;
        value: string;
    }[]>;
    /**
     *
     * @param id
     * @param data
     */
    abstract setMeta(id: string, data: {
        [key: string]: string;
    }): Promise<{
        msg: "success";
    }>;
    /**
     *
     * @param id
     * @param file
     * @param filename
     * @param origFileName
     * @protected
     */
    protected abstract createThumb(id: string, file: UploaderFile, filename: string, origFileName: string): Promise<void>;
    abstract getChildren(id: string): Promise<Item[]>;
    abstract uploadCropped(item: Item, file: UploaderFile, fileName: string, config: {
        width: number;
        height: number;
    }): Promise<Item>;
    abstract delete(id: string): Promise<void>;
}
export declare abstract class AbstractMediaManager {
    id: string;
    path: string;
    dir: string;
    model: string;
    readonly itemTypes: File<Item>[];
    protected constructor(id: string, path: string, dir: string, model: string);
    upload(file: UploaderFile, filename: string, origFileName: string, imageSizes?: imageSizes | {}): Promise<Item>;
    protected getItemType(type: string): File<Item>;
    abstract getAll(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    getChildren(item: Item): Promise<Item[]>;
    uploadCropped(item: Item, file: UploaderFile, fileName: string, config: {
        width: number;
        height: number;
    }): Promise<Item>;
    getMeta(item: Item): Promise<{
        key: string;
        value: string;
    }[]>;
    setMeta(item: Item, data: {
        [key: string]: string;
    }): Promise<{
        msg: "success";
    }>;
    delete(item: Item): Promise<void>;
}
