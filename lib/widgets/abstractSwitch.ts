import BaseWidget from "./abstractWidgetBase";
export default abstract class SwitchBase extends BaseWidget{
    /** Widget background css (color, Image) */
    public readonly backgroundCSS: string;

    /** Get current state */
    public abstract getState(req, res): any

    /** Change the state, returns the one that turned out after the switch */
    public abstract switchIt(req, res): any
}
