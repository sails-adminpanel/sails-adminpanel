import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

type WidgetType = (SwitcherBase | InfoBase | ActionBase | LinkBase);

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

	public static getAll(): Promise<any[]> | Promise<boolean> {
		let widgets = []
		let config = sails.config.adminpanel;
		if (this.widgets.length) {
			for (const widget of this.widgets) {
				if (widget instanceof SwitcherBase) {
					widgets.push({
						id: widget.ID,
						type: widget.widgetType,
						api: `${config.routePrefix}/widgets-switch/${widget.ID}`,
						description: widget.description,
						icon: widget.icon,
						name: widget.name,
						backgroundCSS: widget.backgroundCSS ?? null,
						size: widget.size ?? null
					})
				} else if (widget instanceof InfoBase) {
					widgets.push({
						id: widget.ID,
						type: widget.widgetType,
						api: `${config.routePrefix}/widgets-info/${widget.ID}`,
						description: widget.description,
						icon: widget.icon,
						name: widget.name,
						backgroundCSS: widget.backgroundCSS ?? null,
						size: widget.size ?? null
					})
				} else if (widget instanceof ActionBase) {
					widgets.push({
						id: widget.ID,
						type: widget.widgetType,
						api: `${config.routePrefix}/widgets-action/${widget.ID}`,
						description: widget.description,
						icon: widget.icon,
						name: widget.name,
						backgroundCSS: widget.backgroundCSS ?? null,
						size: widget.size ?? null
					})
				} else if(widget instanceof LinkBase){
					for (const link of widget.links) {
						widgets.push({
							name: link.name,
							description: link.description,
							link: link.link,
							icon: link.icon,
							backgroundCSS: link.backgroundCSS
						})
					}
				}
				else {
					return
				}
			}
		}
		return Promise.resolve(widgets)
	}
}

export async function getAllWidgets(req, res) {
	if (req.method.toUpperCase() === 'GET') {
		return res.json({widgets: await WidgetHandler.getAll()})
	}
}
