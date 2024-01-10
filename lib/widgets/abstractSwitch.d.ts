import BaseWidget from "./abstractWidgetBase";
export default abstract class SwitchBase extends BaseWidget {
    /** Widget background css (color, Image) */
    abstract readonly backgroundCSS: string | null;
    /** Get current state */
    abstract getState(): Promise<boolean>;
    /** Change the state, returns the one that turned out after the switch */
    abstract switchIt(): Promise<boolean>;
}
