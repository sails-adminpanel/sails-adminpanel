import { AbstractMediaManager } from "./AbstractMediaManager";
import * as sharp from "sharp";
import MediaManagerAP from "../../models/MediaManagerAP";
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
    getLibrary(req: ReqType, res: ResType): Promise<void>;
    upload(req: ReqType, res: ResType): Promise<void>;
    protected setData(file: UploaderFile, url: string, filename: string): Promise<Error & {
        id?: string;
        size?: number;
        updatedAt?: number | undefined;
        createdAt?: number | undefined;
        mimeType?: string;
        image_size?: import("sails-typescript").DefaultJsonType | import("sails-typescript").DefaultJsonType[];
        thumb?: boolean;
        url?: string;
        meta?: string;
        parent: MediaManagerAP;
    }[]>;
    protected resizeImage(input: string, output: string, width: number, height: number): Promise<sharp.OutputInfo>;
}
export {};
