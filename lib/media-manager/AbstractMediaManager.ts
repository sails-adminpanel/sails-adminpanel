import sails from "sails-typescript";

export abstract class AbstractMediaManager{
	public abstract id: string
	public abstract path: string
	public abstract dir: string
	public abstract upload(req: ReqType, res: ResType): Promise<sails.Response | void>
	public abstract getLibrary(req: ReqType, res: ResType): Promise<sails.Response>
	public abstract getChildren(req: ReqType, res: ResType): Promise<sails.Response>
	public abstract setMeta(req: ReqType, res: ResType): Promise<sails.Response>
	public abstract getMeta(req: ReqType, res: ResType): Promise<sails.Response>
	public abstract uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void>
}
