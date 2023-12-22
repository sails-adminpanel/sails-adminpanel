import BaseWidget from "./abstractWidgetBase";
export default abstract class InfoBase extends BaseWidget{
    /** Widget background css (color, Image) */
    public readonly backgroundCSS: string;

	/** Widget size */
	public readonly size: {
		h: number
		w: number
	} | null = null

    /** Get info */
    public abstract getInfo(): Promise<string>
}
