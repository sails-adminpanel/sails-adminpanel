import BaseWidget from "./abstractWidgetBase";

export default abstract class ActionBase extends BaseWidget {
	/** Widget background css (color, Image) */
	public abstract readonly backgroundCSS: string | null;

	public abstract action(): Promise<boolean>
}
