import BaseWidget from "./abstractWidgetBase";
export default abstract class InfoBase extends BaseWidget {
    /** Widget background css (color, Image) */
    readonly backgroundCSS: string;
    /** Widget size */
    readonly size: {
        h: number;
        w: number;
    } | null;
    /** Get info */
    abstract getInfo(): Promise<string>;
}
