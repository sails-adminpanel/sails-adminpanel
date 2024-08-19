import sails from "sails-typescript";
export declare abstract class AbstractMediaManager {
    abstract id: string;
    abstract path: string;
    abstract dir: string;
    abstract upload(req: ReqType, res: ResType): Promise<sails.Response | void>;
    abstract getLibrary(req: ReqType, res: ResType): Promise<sails.Response>;
    abstract getChildren(req: ReqType, res: ResType): Promise<sails.Response>;
    abstract setMeta(req: ReqType, res: ResType): Promise<sails.Response>;
    abstract getMeta(req: ReqType, res: ResType): Promise<sails.Response>;
    abstract uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void>;
}
