import BaseWidget from "./abstractWidgetBase";

export interface Links {
	name: string
	description: string
	icon: string | null
	link: string
	backgroundCSS: string | null
}

export default abstract class LinkBase extends BaseWidget {

	readonly abstract links: Links[]

	/** Get info */
	public abstract getLinks(): Promise<Links[]>
}
