import { File, Item, MediaFileType, UploaderFile, imageSizes } from "./AbstractMediaManager";
import * as sharp from "sharp";
export declare class ImageItem extends File<Item> {
    type: MediaFileType;
    model: string;
    metaModel: string;
    imageSizes: imageSizes;
    constructor(path: string, dir: string);
    getItems(limit: number, skip: number, sort: string, group: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    search(s: string, group: string): Promise<Item[]>;
    upload(file: UploaderFile, filename: string, origFileName: string, group: string): Promise<Item[]>;
    getVariants(id: string): Promise<Item[]>;
    protected createVariants(file: UploaderFile, parent: Item, filename: string, group: string): Promise<void>;
    getOrirgin(id: string): Promise<string>;
    protected createMeta(id: string): Promise<void>;
    protected addFileMeta(file: string, id: string): Promise<void>;
    getMeta(id: string): Promise<{
        key: string;
        value: string;
    }[]>;
    setMeta(id: string, data: {
        [p: string]: string;
    }): Promise<void>;
    protected resizeImage(input: string, output: string, width: number, height: number): Promise<sharp.OutputInfo>;
    uploadVariant(parent: Item, file: UploaderFile, filename: string, group: string, localeId: string): Promise<Item>;
    delete(id: string): Promise<void>;
}
export declare class TextItem extends ImageItem {
    type: MediaFileType;
    upload(file: UploaderFile, filename: string, origFileName: string, group: string): Promise<Item[]>;
    getvariants(): Promise<Item[]>;
    uploadVariant(parent: Item, file: UploaderFile, filename: string, group: string, localeId: string): Promise<Item>;
    getVariants(id: string): Promise<Item[]>;
}
export declare class ApplicationItem extends TextItem {
    type: MediaFileType;
}
export declare class VideoItem extends TextItem {
    type: MediaFileType;
}
