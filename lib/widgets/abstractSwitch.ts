import BaseWidget from "./abstractWidgetBase";
export default abstract class SwitchBase extends BaseWidget {

    public readonly widgetType = "switcher"
	

    /** Widget background css (color, Image) */
    public readonly backgroundCSS: string | null = null;

	/** Widget size */
	public readonly size: {
		h: number
		w: number
	} | null = null

    /** Get current state */
    public abstract getState(): Promise<boolean>

    /** Change the state, returns the one that turned out after the switch */
    public abstract switchIt(): Promise<boolean>
}
