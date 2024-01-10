import BaseWidget from "./abstractWidgetBase";
export interface Links {
    name: string;
    description: string;
    icon: string | null;
    link: string;
    backgroundCSS: string | null;
}
export default abstract class LinkBase extends BaseWidget {
    abstract readonly links: Links[];
    /** Widget size */
    readonly size: {
        h: 1;
        w: 1;
    };
    /** Get info */
    abstract getLinks(): Promise<Links[]>;
}
