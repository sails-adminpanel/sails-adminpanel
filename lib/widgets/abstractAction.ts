import BaseWidget from "./abstractWidgetBase";

export default abstract class ActionBase extends BaseWidget {
	/** Widget background css (color, Image) */
	public readonly backgroundCSS: string | null = null;
	/** Widget size */
	public readonly size: {
		h: number
		w: number
	} | null = null

	public abstract action(): Promise<void>
}
