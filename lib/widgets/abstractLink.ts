import { LineAwesomeIcon } from "../../interfaces/lineAwesome";
import BaseWidget from "./abstractWidgetBase";

export interface Links {
	name: string
	description: string
	icon?: LineAwesomeIcon
	link: string
	backgroundCSS: string | null
}

export default abstract class LinkBase extends BaseWidget {

	public readonly widgetType = "link"

	readonly abstract links: Links[]

	/** Get info */
	public abstract getLinks(): Promise<Links[]>
}
