import { AbstractMediaManager } from "../../lib/media-manager/AbstractMediaManager";
export declare class MediaManagerAdapter {
    protected manager: AbstractMediaManager;
    constructor(manager: AbstractMediaManager);
    delete(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    get(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    search(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    getVariants(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    uploadVariant(req: ReqType, res: ResType): Promise<void>;
    upload(req: ReqType, res: ResType): Promise<void>;
    getMeta(req: ReqType, res: ResType): Promise<import("sails-typescript").default.Response>;
    setMeta(req: ReqType, res: ResType): Promise<void>;
    /**
     * Check file type. Return false if the type is allowed.
     * @param allowedTypes
     * @param type
     */
    checkMIMEType(allowedTypes: string[], type: string): boolean;
}
