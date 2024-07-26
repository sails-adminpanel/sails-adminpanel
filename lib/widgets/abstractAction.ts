import BaseWidget from "./abstractWidgetBase";

export default abstract class ActionBase extends BaseWidget {

	public readonly widgetType = "action"

	/** Widget background css (color, Image) */
	public abstract readonly backgroundCSS: string | null;

	public abstract action(): Promise<any>
}
