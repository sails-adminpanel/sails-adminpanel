import BaseWidget from "./abstractWidgetBase";
export default abstract class InfoBase extends BaseWidget {
    /** Widget background css (color, Image) */
    abstract readonly backgroundCSS: string;
    /** Get info */
    abstract getInfo(): Promise<string>;
}
