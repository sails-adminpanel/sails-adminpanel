import { AbstractMediaManager } from "./AbstractMediaManager";
import * as sharp from "sharp";
import sails from "sails-typescript";
interface UploaderFile {
    fd: string;
    size: number;
    type: string;
    filename: string;
    status: string;
    field: string;
    extra: string | undefined;
}
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
    id: string;
    path: string;
    dir: string;
    getLibrary(req: ReqType, res: ResType): Promise<sails.Response>;
    getChildren(req: ReqType, res: ResType): Promise<sails.Response>;
    upload(req: ReqType, res: ResType): Promise<sails.Response | void>;
    uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void>;
    protected createEmptyMeta(): Promise<Error & {
        id?: string;
        author?: string;
        description?: string;
        title?: string;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
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
        meta?: string;
        children: import("../../models/MediaManagerAP").default[];
    }[]>;
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
        meta?: string;
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
            meta?: string;
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
    protected convertImage(input: string, output: string): Promise<sharp.OutputInfo>;
    protected resizeImage(input: string, output: string, width: number, height: number): Promise<sharp.OutputInfo>;
    setMeta(req: ReqType, res: ResType): Promise<sails.Response>;
    getMeta(req: ReqType, res: ResType): Promise<sails.Response>;
}
export {};
