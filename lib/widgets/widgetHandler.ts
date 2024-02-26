import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
import { AccessRightsHelper } from "../../helper/accessRightsHelper";
import UserAP from "../../models/UserAP";
import { LineAwesomeIcon } from "../../interfaces/lineAwesome";
import CustomBase from "./abstractCustom";

type WidgetType = (SwitcherBase | InfoBase | ActionBase | LinkBase | CustomBase);

export interface WidgetConfig {
	id: string;
	type: string;
	api?: string;
	link?: string;
	description: string;
	icon: LineAwesomeIcon;
	name: string;
	backgroundCSS: string;
	scriptUrl?: string;
	constructorName?: string,
	constructorOption?:  any,
	hideAdminPanelUI?: boolean
	size?: { h: number; w: number; };
	added?: boolean;
};

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

	public static getAll(user: UserAP): Promise<WidgetConfig[]> {
		let widgets: WidgetConfig[] = []
		let config = sails.config.adminpanel;
		if (this.widgets.length) {
			let id_key = 0
			for (const widget of this.widgets) {
				if (widget instanceof SwitcherBase) {
					if (AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
						widgets.push({
							id: `${widget.ID}__${id_key}`,
							type: widget.widgetType,
							api: `${config.routePrefix}/widgets-switch/${widget.ID}`,
							description: widget.description,
							icon: widget.icon,
							name: widget.name,
							backgroundCSS: widget.backgroundCSS ?? null,
							size: widget.size ?? null
						})
					}
				} else if (widget instanceof InfoBase) {
					if (AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
						widgets.push({
							id: `${widget.ID}__${id_key}`,
							type: widget.widgetType,
							api: `${config.routePrefix}/widgets-info/${widget.ID}`,
							description: widget.description,
							icon: widget.icon,
							name: widget.name,
							backgroundCSS: widget.backgroundCSS ?? null,
							size: widget.size ?? null
						})
					}
				} else if (widget instanceof ActionBase) {
					if (AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
						widgets.push({
							id: `${widget.ID}__${id_key}`,
							type: widget.widgetType,
							api: `${config.routePrefix}/widgets-action/${widget.ID}`,
							description: widget.description,
							icon: widget.icon,
							name: widget.name,
							backgroundCSS: widget.backgroundCSS ?? null,
							size: widget.size ?? null
						})
					}
				} else if (widget instanceof LinkBase) {
					if (AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
						let links_id_key = 0
						for (const link of widget.links) {
							widgets.push({
								name: link.name,
								id: `${widget.ID}__${links_id_key}`,
								type: 'link',
								description: link.description,
								link: link.link,
								icon: link.icon,
								backgroundCSS: link.backgroundCSS
							})
							links_id_key++;
						}
					}
				} else if (widget instanceof CustomBase) {
					if (AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
						widgets.push({
							id: `${widget.ID}_${id_key}`,
							type: widget.widgetType,
							api: `${config.routePrefix}/widgets-custom/${widget.ID}`,
							description: widget.description,
							icon: widget.icon,
							name: widget.name,
							backgroundCSS: widget.backgroundCSS ?? null,
							size: widget.size ?? null,
							scriptUrl: widget.scriptUrl,
							constructorName: widget.constructorName,
							constructorOption:  widget.constructorOption,
							hideAdminPanelUI: widget.hideAdminPanelUI
						})
					}
				} else {
					return Promise.resolve([])
				}
			}
		}
		return Promise.resolve(widgets)
	}

	public static async getWidgetsDB(id: number, auth: boolean): Promise<WidgetConfig[]> {
		let user: UserAP;
		let widgets: WidgetConfig[];
		if (!auth) {
			user = await UserAP.findOne({ login: sails.config.adminpanel.administrator?.login ?? 'admin' })
		} else {
			user = await UserAP.findOne({ id: id })
		}

		if (!Boolean(user.widgets)) {
			if (sails.config.adminpanel.dashboard && typeof sails.config.adminpanel.dashboard !== "boolean" && sails.config.adminpanel.dashboard.defaultWidgets) {
				let defaultWidgets = sails.config.adminpanel.dashboard.defaultWidgets;
				widgets = await this.getAll(user);
				widgets.forEach(widget => {
					if (defaultWidgets.includes(widget.id.split("__")[0])) {
						widget.added = true;
					}
				})
			}
		}
		return widgets
	}

	public static async setWidgetsDB(id: number, widgets: WidgetConfig[], auth: boolean): Promise<number> {
		if (!auth) {
			let updatedUser = await UserAP.updateOne({ login: sails.config.adminpanel.administrator?.login ?? 'admin' }, { widgets: widgets })
			return updatedUser.id
		} else {
			let updatedUser = await UserAP.updateOne({ id: id }, { widgets: widgets })
			return updatedUser.id
		}

	}
}

// TODO: move to folder controlles
export async function getAllWidgets(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	if (req.method.toUpperCase() === 'GET') {
		try {
			return res.json({ widgets: await WidgetHandler.getAll(req.session.UserAP) })
		} catch (e) {
			return res.serverError(e)
		}
	}
}

// TODO: move in controller folder
export async function widgetsDB(req, res) {
	let id: number = 0
	let auth = sails.config.adminpanel.auth
	if (auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
		id = req.session.UserAP.id
	}

	if (req.method.toUpperCase() === 'GET') {
		try {
			let widgets = await WidgetHandler.getWidgetsDB(id, auth);
			return res.json({ widgetsDB: widgets })
		} catch (e) {
			return res.serverError(e)
		}
	}

	if (req.method.toUpperCase() === 'POST') {
		if (!req.body.widgets) {
			return res.send('Invalid data')
		}
		try {
			return res.json({
				userID: await WidgetHandler.setWidgetsDB(id, req.body.widgets, auth),
				status: 'ok'
			})
		} catch (e) {
			return res.serverError(e)
		}
	}
}
