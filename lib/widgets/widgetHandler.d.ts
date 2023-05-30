import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
import UserAP from "../../models/UserAP";
declare type WidgetType = (SwitcherBase | InfoBase | ActionBase | LinkBase);
export declare class WidgetHandler {
    private static widgets;
    static add(widget: WidgetType): void;
    static getById(id: string): WidgetType | undefined;
    static removeById(id: string): void;
    static getAll(user: UserAP): Promise<any[]> | Promise<boolean>;
    static getWidgetsDB(id: number, auth: boolean): Promise<any>;
    static setWidgetsDB(id: number, widgets: any, auth: boolean): Promise<number>;
}
export declare function getAllWidgets(req: any, res: any): Promise<any>;
export declare function widgetsDB(req: any, res: any): Promise<any>;
export {};
