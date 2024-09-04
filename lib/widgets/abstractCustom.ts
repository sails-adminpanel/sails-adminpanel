import BaseWidget from "./abstractWidgetBase";

export default abstract class CustomBase extends BaseWidget{
    /** Widget background css (color, Image) */
    public abstract readonly  backgroundCSS: string | null;

    /** Fullpath script for loading in dashboard in browser */
    public abstract readonly scriptUrl: string;

    /** How widgets processor can call constructor of this widget */
    public abstract readonly constructorName: string;

    /** Options to constuctor */
    public abstract readonly constructorOption: any;

    /** Hide title, icon, description */
    public abstract readonly hideAdminPanelUI: boolean;
}
