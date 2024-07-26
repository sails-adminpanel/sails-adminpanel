import { LineAwesomeIcon } from "../../interfaces/lineAwesome";
import BaseWidget from "./abstractWidgetBase";
export interface Links {
    name: string;
    description: string;
    icon?: LineAwesomeIcon;
    link: string;
    backgroundCSS: string | null;
}
export default abstract class LinkBase extends BaseWidget {
    readonly widgetType = "link";
    readonly abstract links: Links[];
    /** Get info */
    abstract getLinks(): Promise<Links[]>;
}
