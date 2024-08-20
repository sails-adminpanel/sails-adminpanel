import { File, Item, UploaderFile, imageSizes } from '../AbstractMediaManager';
export declare class ImageItem extends File<Item> {
    id: string;
    type: "application" | "audio" | "example" | "image" | "message" | "model" | "multipart" | "text" | "video";
    constructor(path: string, dir: string, model: string, metaModel: string);
    upload(file: UploaderFile, filename: string, origFileName: string, imageSizes: imageSizes): Promise<Item>;
    protected createThumb(parentId: string, file: UploaderFile, filename: string, origFileName: string): Promise<void>;
    protected createEmptyMeta(id: string): Promise<void>;
    getMeta(id: string): Promise<{
        key: string;
        value: string;
    }[]>;
    setMeta(id: string, data: {
        [p: string]: string;
    }): Promise<{
        msg: "success";
    }>;
}
