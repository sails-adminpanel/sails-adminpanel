export declare abstract class AbstractMediaManager {
    abstract id: string;
    abstract path: string;
    abstract dir: string;
    abstract upload(req: ReqType, res: ResType): Promise<void>;
    abstract getLibrary(req: ReqType, res: ResType): Promise<void>;
}
