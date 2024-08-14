import sails from "sails-typescript";

export abstract class AbstractMediaManager{
	public abstract id: string

	public abstract upload(req: ReqType, res: ResType):void


}
