import { AbstractMediaManager } from "./AbstractMediaManager";
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
    upload(req: ReqType, res: ResType): void;
    protected setData(file: UploaderFile[]): Promise<void>;
}
export {};
