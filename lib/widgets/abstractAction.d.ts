import BaseWidget from "./abstractWidgetBase";
export default abstract class ActionBase extends BaseWidget {
    /** Widget background css (color, Image) */
    readonly backgroundCSS: string | null;
    /** Widget size */
    readonly size: {
        h: number;
        w: number;
    } | null;
    abstract action(): Promise<boolean>;
}
