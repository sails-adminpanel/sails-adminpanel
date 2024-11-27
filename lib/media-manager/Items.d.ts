import { File, MediaManagerItem, MediaFileType, UploaderFile, imageSizes, SortCriteria } from "./AbstractMediaManager";
import * as sharp from "sharp";
export declare class ImageItem extends File<MediaManagerItem> {
    type: MediaFileType;
    model: string;
    metaModel: string;
    imageSizes: imageSizes;
    constructor(urlPathPrefix: string, fileStoragePath: string);
    getItems(limit: number, skip: number, sort: SortCriteria, group: string): Promise<{
        data: MediaManagerItem[];
        next: boolean;
    }>;
    search(s: string, group: string): Promise<MediaManagerItem[]>;
    upload(file: UploaderFile, filename: string, origFileName: string, group: string): Promise<MediaManagerItem[]>;
    getVariants(id: string): Promise<MediaManagerItem[]>;
    protected createVariants(file: UploaderFile, parent: MediaManagerItem, filename: string, group: string): Promise<void>;
    getOrigin(id: string): Promise<string>;
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
    uploadVariant(parent: MediaManagerItem, file: UploaderFile, filename: string, group: string, localeId: string): Promise<MediaManagerItem>;
    delete(id: string): Promise<void>;
}
export declare class TextItem extends ImageItem {
    type: MediaFileType;
    upload(file: UploaderFile, filename: string, origFileName: string, group: string): Promise<MediaManagerItem[]>;
    getvariants(): Promise<MediaManagerItem[]>;
    uploadVariant(parent: MediaManagerItem, file: UploaderFile, filename: string, group: string, localeId: string): Promise<MediaManagerItem>;
    getVariants(id: string): Promise<MediaManagerItem[]>;
}
export declare class ApplicationItem extends TextItem {
    type: MediaFileType;
}
export declare class VideoItem extends TextItem {
    type: MediaFileType;
}
