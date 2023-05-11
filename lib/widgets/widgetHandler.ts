
import SwitchrBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import { AccessRightsHelper } from "../../helper/accessRightsHelper";

type WidgetType = (SwitchrBase | InfoBase);

export class WidgetHandler {
  private static widgets: WidgetType[] = [];

  public static add(widget: WidgetType): void {
    AccessRightsHelper.registerToken({id: `widget-${widget.id}`, name: widget.name, description: widget.description, department: widget.department});
    this.widgets.push(widget);
  }

  public static getById(id: string): WidgetType | undefined {
    return this.widgets.find(widget => widget.ID === id);
  }

  public static removeById(id: string): void {
    const index = this.widgets.findIndex(widget => widget.id === id);
    if (index !== -1) {
      this.widgets.splice(index, 1);
    }
  }
}