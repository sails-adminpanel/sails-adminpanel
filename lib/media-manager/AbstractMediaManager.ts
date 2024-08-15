import sails from "sails-typescript";

export abstract class AbstractMediaManager{
	public abstract id: string
	public abstract path: string
	public abstract dir: string
	public abstract upload(req: ReqType, res: ResType): Promise<void>
	public abstract getLibrary(req: ReqType, res: ResType): Promise<void>
}
