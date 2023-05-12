import BaseWidget from "./abstractWidgetBase";
export default abstract class InfoBase extends BaseWidget{
    /** Widget background css (color, Image) */
    public readonly backgroundCSS: string;

    /** Get current state */
    public abstract getState(): Promise<string>
}
