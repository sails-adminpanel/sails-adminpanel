import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
import CustomBase from "./abstractCustom";
import UserAP from "../../models/UserAP";
type WidgetType = (SwitcherBase | InfoBase | ActionBase | LinkBase | CustomBase);
export declare class WidgetHandler {
    private static widgets;
    static add(widget: WidgetType): void;
    static getById(id: string): WidgetType | undefined;
    static removeById(id: string): void;
    static getAll(user: UserAP): Promise<WidgetConfig[]>;
    static getWidgetsDB(id: number, auth: boolean): Promise<WidgetConfig[]>;
    static setWidgetsDB(id: number, widgets: WidgetConfig[], auth: boolean): Promise<number>;
}
export declare function getAllWidgets(req: any, res: any): Promise<any>;
export declare function widgetsDB(req: any, res: any): Promise<any>;
export {};
