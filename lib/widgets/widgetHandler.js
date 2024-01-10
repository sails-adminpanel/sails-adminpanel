"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.widgetsDB = exports.getAllWidgets = exports.WidgetHandler = void 0;
const abstractSwitch_1 = require("./abstractSwitch");
const abstractInfo_1 = require("./abstractInfo");
const abstractAction_1 = require("./abstractAction");
const abstractLink_1 = require("./abstractLink");
const abstractCustom_1 = require("./abstractCustom");
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
class WidgetHandler {
    static add(widget) {
        accessRightsHelper_1.AccessRightsHelper.registerToken({
            id: `widget-${widget.ID}`,
            name: widget.name,
            description: widget.description,
            department: widget.department
        });
        this.widgets.push(widget);
    }
    static getById(id) {
        if (this.widgets.length) {
            return this.widgets.find(widget => widget.ID === id);
        }
        else {
            return undefined;
        }
    }
    static removeById(id) {
        if (this.widgets.length) {
            const index = this.widgets.findIndex(widget => widget.ID === id);
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
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
                        widgets.push({
                            id: `${widget.ID}_${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-switch/${widget.ID}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null
                        });
                    }
                }
                else if (widget instanceof abstractInfo_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
                        widgets.push({
                            id: `${widget.ID}_${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-info/${widget.ID}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null
                        });
                    }
                }
                else if (widget instanceof abstractAction_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
                        widgets.push({
                            id: `${widget.ID}_${id_key}`,
                            type: widget.widgetType,
                            api: `${config.routePrefix}/widgets-action/${widget.ID}`,
                            description: widget.description,
                            icon: widget.icon,
                            name: widget.name,
                            backgroundCSS: widget.backgroundCSS ?? null,
                            size: widget.size ?? null
                        });
                    }
                }
                else if (widget instanceof abstractLink_1.default) {
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
                        let links_id_key = 0;
                        for (const link of widget.links) {
                            widgets.push({
                                name: link.name,
                                id: `${widget.ID}_${links_id_key}`,
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
                    if (accessRightsHelper_1.AccessRightsHelper.havePermission(`widget-${widget.ID}`, user)) {
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
                            constructorOption: widget.constructorOption,
                            hideAdminPanelUI: widget.hideAdminPanelUI
                        });
                    }
                }
                else {
                    return;
                }
            }
        }
        return Promise.resolve(widgets);
    }
    static async getWidgetsDB(id, auth) {
        if (!auth) {
            let widgets = await UserAP.findOne({ login: sails.config.adminpanel.administrator.login });
            return widgets.widgets;
        }
        else {
            let widgets = await UserAP.findOne({ id: id });
            return widgets.widgets;
        }
    }
    static async setWidgetsDB(id, widgets, auth) {
        if (!auth) {
            let updatedUser = await UserAP.updateOne({ login: sails.config.adminpanel.administrator.login }, { widgets: widgets });
            return updatedUser.id;
        }
        else {
            let updatedUser = await UserAP.updateOne({ id: id }, { widgets: widgets });
            return updatedUser.id;
        }
    }
}
WidgetHandler.widgets = [];
exports.WidgetHandler = WidgetHandler;
async function getAllWidgets(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    if (req.method.toUpperCase() === 'GET') {
        try {
            return res.json({ widgets: await WidgetHandler.getAll(req.session.UserAP) });
        }
        catch (e) {
            return res.serverError(e);
        }
    }
}
exports.getAllWidgets = getAllWidgets;
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
            return res.json({ widgetsDB: await WidgetHandler.getWidgetsDB(id, auth) });
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
exports.widgetsDB = widgetsDB;
