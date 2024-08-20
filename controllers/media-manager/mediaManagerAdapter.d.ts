import { AbstractMediaManager } from "../../lib/media-manager/AbstractMediaManager";
export declare class MediaManagerAdapter {
    protected manager: AbstractMediaManager;
    constructor(manager: AbstractMediaManager);
    getLibrary(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    upload(req: ReqType, res: ResType): Promise<void>;
    getMeta(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    setMeta(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
}
