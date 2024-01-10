import BaseWidget from "./abstractWidgetBase";

export interface Links {
	name: string
	description: string
	icon: string | null
	link: string
	backgroundCSS: string | null
}

export default abstract class LinkBase extends BaseWidget {

	public abstract readonly  links: Links[]

	/** Widget size */
	public readonly size: {
		h: 1
		w: 1
	} 

	/** Get info */
	public abstract getLinks(): Promise<Links[]>
}
