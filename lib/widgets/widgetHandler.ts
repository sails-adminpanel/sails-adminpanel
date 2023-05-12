import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

type WidgetType = (SwitcherBase | InfoBase);

export class WidgetHandler {
	private static widgets: WidgetType[] = [];

	public static add(widget: WidgetType): void {
		AccessRightsHelper.registerToken({
			id: `widget-${widget.ID}`,
			name: widget.name,
			description: widget.description,
			department: widget.department
		});
		this.widgets.push(widget);
	}

	public static getById(id: string): WidgetType | undefined {
		if (this.widgets.length) {
			return this.widgets.find(widget => widget.ID === id);
		} else {
			return undefined
		}
	}

	public static removeById(id: string): void {
		if (this.widgets.length) {
			const index = this.widgets.findIndex(widget => widget.ID === id);
			if (index !== -1) {
				this.widgets.splice(index, 1);
			}
		}
	}
}
