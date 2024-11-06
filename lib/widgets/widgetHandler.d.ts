import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
import { UserAPRecord } from "../../models/UserAP";
import CustomBase from "./abstractCustom";
import { AdminpanelIcon } from "../../interfaces/adminpanelConfig";
export type WidgetType = (SwitcherBase | InfoBase | ActionBase | LinkBase | CustomBase);
export interface WidgetConfig {
    id: string;
    type: string;
    api?: string;
    link?: string;
    description: string;
    icon: AdminpanelIcon;
    name: string;
    backgroundCSS: string;
    scriptUrl?: string;
    constructorName?: string;
    constructorOption?: any;
    size?: {
        h: number;
        w: number;
    };
    added?: boolean;
    hideAdminPanelUI?: boolean;
}
export declare class WidgetHandler {
    private static widgets;
    static add(widget: WidgetType): void;
    static getById(id: string): WidgetType | undefined;
    static removeById(id: string): void;
    static getAll(user: UserAPRecord): Promise<WidgetConfig[]>;
    static getWidgetsDB(id: number, auth: boolean): Promise<WidgetConfig[]>;
    static setWidgetsDB(id: number, widgets: WidgetConfig[], auth: boolean): Promise<number>;
}
export declare function getAllWidgets(req: ReqType, res: ResType): Promise<void>;
export declare function widgetsDB(req: ReqType, res: ResType): Promise<void | import("sails-typescript").default.Response>;
