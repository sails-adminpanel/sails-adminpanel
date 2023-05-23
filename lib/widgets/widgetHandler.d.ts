import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
declare type WidgetType = (SwitcherBase | InfoBase | ActionBase | LinkBase);
export declare class WidgetHandler {
    private static widgets;
    static add(widget: WidgetType): void;
    static getById(id: string): WidgetType | undefined;
    static removeById(id: string): void;
    static getAll(): Promise<any[]> | Promise<boolean>;
}
export declare function getAllWidgets(req: any, res: any): Promise<any>;
export {};
