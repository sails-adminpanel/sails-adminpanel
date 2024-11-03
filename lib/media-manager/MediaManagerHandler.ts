import {AbstractMediaManager} from "./AbstractMediaManager";

export class MediaManagerHandler{
	private static managers: AbstractMediaManager[] = []

	public static add(manager: AbstractMediaManager){
		this.managers.push(manager)
	}

	public static get(id: string):AbstractMediaManager{
		return this.managers.find(e => e.id === id)
	}
}
