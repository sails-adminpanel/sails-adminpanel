import BaseWidget from "./abstractWidgetBase";
export default abstract class CustomBase extends BaseWidget {
    /** Widget background css (color, Image) */
    abstract readonly backgroundCSS: string | null;
    /** Fullpath script for loading in dashboard in browser */
    abstract readonly scriptUrl: string;
    /** How widgets processor can call constructor of this widget */
    abstract readonly constructorName: string;
    /** Options to constuctor */
    abstract readonly constructorOption: any;
    /** Hide title, icon, description */
    abstract readonly hideAdminPanelUI: boolean;
}
