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
export declare class DefaultMediaManager extends AbstractMediaManager {
    id: string;
    path: string;
    dir: string;
    getLibrary(req: ReqType, res: ResType): Promise<sails.Response>;
    upload(req: ReqType, res: ResType): Promise<sails.Response | void>;
    protected setData(file: UploaderFile, url: string, filename: string): Promise<Error & {
        id?: string;
        size?: number;
        updatedAt?: number | undefined;
        createdAt?: number | undefined;
        parent?: string;
        mimeType?: string;
        image_size?: import("sails-typescript").DefaultJsonType | import("sails-typescript").DefaultJsonType[];
        thumb?: boolean;
        url?: string;
        meta?: string;
        children: import("../../models/MediaManagerAP").default[];
    }[]>;
    protected resizeImage(input: string, output: string, width: number, height: number): Promise<sharp.OutputInfo>;
    setMeta(req: ReqType, res: ResType): Promise<sails.Response>;
    getMeta(req: ReqType, res: ResType): Promise<sails.Response>;
}
export {};
