import BaseWidget from "./abstractWidgetBase";
export default abstract class InfoBase extends BaseWidget {
    /** Widget background css (color, Image) */
    readonly backgroundCSS: string;
    /** Get current state */
    abstract getState(): Promise<boolean>;
}
