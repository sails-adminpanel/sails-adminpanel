import SwitcherBase from "./abstractSwitch";
import InfoBase from "./abstractInfo";
import ActionBase from "./abstractAction";
import LinkBase from "./abstractLink";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import UserAP from "../../models/UserAP";

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

	public static getAll(user: UserAP): Promise<any[]> | Promise<boolean> {
		let widgets = []
		let config = sails.config.adminpanel;
		if (this.widgets.length) {
			let id_key = 0
			for (const widget of this.widgets) {
				if (widget instanceof SwitcherBase) {
					if (AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
						widgets.push({
							id: `${widget.ID}_${id_key}`,
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
							id: `${widget.ID}_${id_key}`,
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
							id: `${widget.ID}_${id_key}`,
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
								id: `${widget.ID}_${links_id_key}`,
								type: 'link',
								description: link.description,
								link: link.link,
								icon: link.icon,
								backgroundCSS: link.backgroundCSS
							})
							links_id_key++;
						}
					}
				} else {
					return
				}
			}
		}
		return Promise.resolve(widgets)
	}

	public static async getWidgetsDB(id: number, auth: boolean) {
		if(!auth){
			let widgets = await UserAP.findOne({login: sails.config.adminpanel.administrator.login})
			return widgets.widgets
		}else{
			let widgets = await UserAP.findOne({id: id})
			return widgets.widgets
		}
	}

	public static async setWidgetsDB(id: number, widgets: any, auth: boolean) {
		if(!auth){
			let updatedUser = await UserAP.updateOne({login: sails.config.adminpanel.administrator.login}, {widgets: widgets})
			return updatedUser.id
		} else{
			let updatedUser = await UserAP.updateOne({id: id}, {widgets: widgets})
			return updatedUser.id
		}

	}
}


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
			return res.json({widgets: await WidgetHandler.getAll(req.session.UserAP)})
		} catch (e) {
			return res.serverError(e)
		}
	}
}

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
			return res.json({widgetsDB: await WidgetHandler.getWidgetsDB(id, auth)})
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
