import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
declare type WidgetType = (SwitcherBase | InfoBase);
export declare class WidgetHandler {
    private static widgets;
    static add(widget: WidgetType): void;
    static getById(id: string): WidgetType | undefined;
    static removeById(id: string): void;
    static getAll(): Promise<any[]> | Promise<boolean>;
}
export declare function getAllWidgets(req: any, res: any): Promise<any>;
export {};
