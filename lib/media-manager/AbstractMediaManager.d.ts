import * as sharp from "sharp";
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
    /**
     * @param {string} meta - Assoc model id
     */
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
    abstract id: string;
    abstract type: "application" | "audio" | "example" | "image" | "message" | "model" | "multipart" | "text" | "video";
    path: string;
    dir: string;
    model: string;
    metaModel: string;
    protected constructor(path: string, dir: string, model: string, metaModel: string);
    abstract upload(file: UploaderFile, filename: string, origFileName: string, imageSizes: imageSizes): Promise<T>;
    abstract getMeta(id: string): Promise<{
        key: string;
        value: string;
    }[]>;
    abstract setMeta(id: string, data: {
        [key: string]: string;
    }): Promise<{
        msg: "success";
    }>;
    protected abstract createThumb(parentId: string, file: UploaderFile, filename: string, origFileName: string): Promise<void>;
    protected convertImage(input: string, output: string): Promise<sharp.OutputInfo>;
    protected resizeImage(input: string, output: string, width: number, height: number): Promise<sharp.OutputInfo>;
}
export declare abstract class AbstractMediaManager {
    id: string;
    path: string;
    dir: string;
    model: string;
    readonly itemTypes: File<Item>[];
    protected constructor(id: string, path: string, dir: string, model: string);
    upload(file: UploaderFile, filename: string, origFileName: string, imageSizes: imageSizes): Promise<Item>;
    protected getItemType(type: string): File<Item>;
    abstract getLibrary(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    abstract getChildren(req: ReqType, res: ResType): Promise<sails.Response>;
    getMeta(id: string, mimeType: string): Promise<{
        key: string;
        value: string;
    }[]>;
    setMeta(id: string, mimeType: string, data: {
        [key: string]: string;
    }): Promise<{
        msg: "success";
    }>;
    abstract uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void>;
}
