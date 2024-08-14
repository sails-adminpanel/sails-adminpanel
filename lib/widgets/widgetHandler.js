"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetHandler = void 0;
exports.getAllWidgets = getAllWidgets;
exports.widgetsDB = widgetsDB;
const abstractSwitch_1 = require("./abstractSwitch");
const abstractInfo_1 = require("./abstractInfo");
const abstractAction_1 = require("./abstractAction");
const abstractLink_1 = require("./abstractLink");
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
const abstractCustom_1 = require("./abstractCustom");
;
class WidgetHandler {
    static add(widget) {
        accessRightsHelper_1.AccessRightsHelper.registerToken({
            id: `widget-${widget.id}`,
            name: widget.name,
            description: widget.description,
            department: widget.department
        });
        this.widgets.push(widget);
    }
    static getById(id) {
        if (this.widgets.length) {
            return this.widgets.find(widget => widget.id === id);
        }
        else {
            return undefined;
        }
    }
    static removeById(id) {
        if (this.widgets.length) {
            const index = this.widgets.findIndex(widget => widget.id === id);
            if (index !== -1) {
                this.widgets.splice(index, 1);
            }
        }
    }
    static getAll(user) {
        let widgets = [];
        let config = sails.config.adminpanel;
        if (this.widgets.length) {
            let id_key = 0;
            for (const widget of this.widgets) {
                if (widget instanceof abstractSwitch_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.id}`, user)) {
                        widgets.push({
                            id: `${widget.id}__${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-switch/${widget.id}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null
                        });
                    }
                }
                else if (widget instanceof abstractInfo_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.id}`, user)) {
                        widgets.push({
                            id: `${widget.id}__${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-info/${widget.id}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null
                        });
                    }
                }
                else if (widget instanceof abstractAction_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.id}`, user)) {
                        widgets.push({
                            id: `${widget.id}__${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-action/${widget.id}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null
                        });
                    }
                }
                else if (widget instanceof abstractLink_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.id}`, user)) {
                        let links_id_key = 0;
                        for (const link of widget.links) {
                            widgets.push({
                                name: link.name,
                                id: `${widget.id}__${links_id_key}`,
                                type: 'link',
                                description: link.description,
                                link: link.link,
                                icon: link.icon,
                                backgroundCSS: link.backgroundCSS
                            });
                            links_id_key++;
                        }
                    }
                }
                else if (widget instanceof abstractCustom_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.id}`, user)) {
                        widgets.push({
                            id: `${widget.id}_${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-custom/${widget.id}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null,
                            scriptUrl: widget.scriptUrl,
                            constructorName: widget.constructorName,
                            constructorOption: widget.constructorOption,
                            hideAdminPanelUI: widget.hideAdminPanelUI
                        });
                    }
                }
                else {
                    return Promise.resolve([]);
                }
            }
        }
        return Promise.resolve(widgets);
    }
    static async getWidgetsDB(id, auth) {
        let user;
        let widgets;
        if (!auth) {
            user = await UserAP.findOne({ login: sails.config.adminpanel.administrator?.login ?? 'admin' });
        }
        else {
            user = await UserAP.findOne({ id: id });
        }
        if (!user || !user.widgets || user.widgets.length === 0) {
            if (sails.config.adminpanel.dashboard && typeof sails.config.adminpanel.dashboard !== "boolean" && sails.config.adminpanel.dashboard.defaultWidgets) {
                let defaultWidgets = sails.config.adminpanel.dashboard.defaultWidgets;
                widgets = await this.getAll(user);
                widgets.forEach(widget => {
                    if (defaultWidgets.includes(widget.id.split("__")[0])) {
                        widget.added = true;
                    }
                });
            }
        }
        else {
            widgets = user.widgets;
        }
        return widgets;
    }
    static async setWidgetsDB(id, widgets, auth) {
        if (!auth) {
            let updatedUser = await UserAP.updateOne({ login: sails.config.adminpanel.administrator?.login ?? 'admin' }, { widgets: widgets });
            return updatedUser.id;
        }
        else {
            let updatedUser = await UserAP.updateOne({ id: id }, { widgets: widgets });
            return updatedUser.id;
        }
    }
}
exports.WidgetHandler = WidgetHandler;
WidgetHandler.widgets = [];
// TODO: move to folder controlles
async function getAllWidgets(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
            return;
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
            res.sendStatus(403);
            return;
        }
    }
    if (req.method.toUpperCase() === 'GET') {
        try {
            res.json({ widgets: await WidgetHandler.getAll(req.session.UserAP) });
            return;
        }
        catch (e) {
            res.serverError(e);
            return;
        }
    }
}
// TODO: move in controller folder
async function widgetsDB(req, res) {
    let id = 0;
    let auth = sails.config.adminpanel.auth;
    if (auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
        id = req.session.UserAP.id;
    }
    if (req.method.toUpperCase() === 'GET') {
        try {
            let widgets = await WidgetHandler.getWidgetsDB(id, auth);
            return res.json({ widgetsDB: widgets });
        }
        catch (e) {
            return res.serverError(e);
        }
    }
    if (req.method.toUpperCase() === 'POST') {
        if (!req.body.widgets) {
            return res.send('Invalid data');
        }
        try {
            return res.json({
                userID: await WidgetHandler.setWidgetsDB(id, req.body.widgets, auth),
                status: 'ok'
            });
        }
        catch (e) {
            return res.serverError(e);
        }
    }
}
