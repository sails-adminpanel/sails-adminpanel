import { AbstractMediaManager } from "../../lib/media-manager/AbstractMediaManager";
export declare class MediaManagerAdapter {
    protected manager: AbstractMediaManager;
    constructor(manager: AbstractMediaManager);
    delete(req: ReqTypeAP, res: ResTypeAP): Promise<import("sails-typescript").default.Response>;
    get(req: ReqTypeAP, res: ResTypeAP): Promise<import("sails-typescript").default.Response>;
    search(req: ReqTypeAP, res: ResTypeAP): Promise<import("sails-typescript").default.Response>;
    getVariants(req: ReqTypeAP, res: ResTypeAP): Promise<import("sails-typescript").default.Response>;
    uploadVariant(req: ReqTypeAP, res: ResTypeAP): Promise<void>;
    upload(req: ReqTypeAP, res: ResTypeAP): Promise<void>;
    getMeta(req: ReqTypeAP, res: ResTypeAP): Promise<import("sails-typescript").default.Response>;
    setMeta(req: ReqTypeAP, res: ResTypeAP): Promise<void>;
    /**
     * Check file type. Return false if the type is allowed.
     * @param allowedTypes
     * @param type
     */
    checkMIMEType(allowedTypes: string[], type: string): boolean;
}
