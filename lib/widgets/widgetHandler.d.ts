import SwitchrBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
type WidgetType = (SwitchrBase | InfoBase);
export declare class WidgetHandler {
    private static widgets;
    static add(widget: WidgetType): void;
    static getById(id: string): WidgetType | undefined;
    static removeById(id: string): void;
}
export {};
