import { AbstractMediaManager, UploaderFile, Item, File } from "./AbstractMediaManager";
interface config {
    convert: string;
    sizes: {
        [key: string]: {
            width: number;
            height: number;
        };
    }[];
}
export declare class DefaultMediaManager extends AbstractMediaManager {
    readonly itemTypes: File<Item>[];
    constructor(id: string, path: string, dir: string, model: string, metaModel: string);
    getLibrary(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    protected setData(file: UploaderFile, url: string, filename: string, config: config, origFileName: string): Promise<Error & {
        id?: string;
        size?: number;
        updatedAt?: number | undefined;
        createdAt?: number | undefined;
        parent?: string;
        mimeType?: string;
        path?: string;
        image_size?: import("sails-typescript").DefaultJsonType | import("sails-typescript").DefaultJsonType[];
        cropType?: string;
        url?: string;
        filename?: string;
        meta?: import("../../models/MediaManagerMetaAP").default[] | string[];
        children: import("../../models/MediaManagerAP").default[];
    }[]>;
    getChildren(req: ReqType, res: ResType): Promise<sails.Response>;
    uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void>;
    private saveFile;
    protected setImage(file: UploaderFile, url: string, filename: string, config: config, origFileName: string): Promise<Error & {
        id?: string;
        size?: number;
        updatedAt?: number | undefined;
        createdAt?: number | undefined;
        parent?: string;
        mimeType?: string;
        path?: string;
        image_size?: import("sails-typescript").DefaultJsonType | import("sails-typescript").DefaultJsonType[];
        cropType?: string;
        url?: string;
        filename?: string;
        meta?: import("../../models/MediaManagerMetaAP").default[] | string[];
        children: import("../../models/MediaManagerAP").default[];
    }[]>;
    protected prepareOrigin(file: UploaderFile, url: string, filename: string, config: config, origFileName: string): Promise<{
        parentDB: Error & {
            id?: string;
            parent?: string;
            children?: import("../../models/MediaManagerAP").default[] | string[];
            mimeType?: string;
            path?: string;
            size?: number;
            image_size?: import("sails-typescript").DefaultJsonType | import("sails-typescript").DefaultJsonType[];
            cropType?: string;
            url?: string;
            filename?: string;
            meta?: import("../../models/MediaManagerMetaAP").default[] | string[];
            createdAt?: number | undefined;
            updatedAt?: number | undefined;
        };
        resFile: string;
        resFilename: string;
        resMIME: string;
    }>;
    protected checkConvert(config: config, file: UploaderFile): boolean;
    protected getConvertExtensions(s: string): string;
    protected createSizes(parent: {
        id: string;
        size: {
            width: number;
            height: number;
        };
    }, filename: string, file: string, MIME: string, config: config, origFileName: string): Promise<void>;
}
export {};
