import BaseWidget from "./abstractWidgetBase";
export default abstract class InfoBase extends BaseWidget{
    /** Widget background css (color, Image) */
    public abstract readonly backgroundCSS: string;

    /** Get info */
    public abstract getInfo(): Promise<string>
}
