import { File, Item, MediaFileType, UploaderFile, imageSizes } from "./AbstractMediaManager";
import * as sharp from "sharp";
export declare class ImageItem extends File<Item> {
    type: MediaFileType;
    model: string;
    metaModel: string;
    constructor(path: string, dir: string);
    getItems(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    search(s: string): Promise<Item[]>;
    upload(file: UploaderFile, filename: string, origFileName: string): Promise<Item[]>;
    getChildren(id: string): Promise<Item[]>;
    createVariants(file: UploaderFile, parent: Item, filename: string, imageSizes: imageSizes): Promise<void>;
    getOrirgin(id: string): Promise<string>;
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
    protected resizeImage(input: string, output: string, width: number, height: number): Promise<sharp.OutputInfo>;
    uploadVarinat(parent: Item, file: UploaderFile, filename: string, config: {
        width: number;
        height: number;
    }): Promise<Item>;
    delete(id: string): Promise<void>;
}
export declare class TextItem extends ImageItem {
    type: MediaFileType;
    upload(file: UploaderFile, filename: string, origFileName: string): Promise<Item[]>;
    getChildren(): Promise<Item[]>;
    uploadCropped(): Promise<Item>;
    createVariants(): Promise<void>;
}
export declare class ApplicationItem extends TextItem {
    type: MediaFileType;
}
export declare class VideoItem extends TextItem {
    type: MediaFileType;
}
