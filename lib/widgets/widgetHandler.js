"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWidgets = exports.WidgetHandler = void 0;
const abstractSwitch_1 = require("./abstractSwitch");
const abstractInfo_1 = require("./abstractInfo");
const abstractAction_1 = require("./abstractAction");
const abstractLink_1 = require("./abstractLink");
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
    static getAll() {
        let widgets = [];
        let config = sails.config.adminpanel;
        if (this.widgets.length) {
            for (const widget of this.widgets) {
                if (widget instanceof abstractSwitch_1.default) {
                    widgets.push({
                        id: widget.ID,
                        type: widget.widgetType,
                        api: `${config.routePrefix}/widgets-switch/${widget.ID}`,
                        description: widget.description,
                        icon: widget.icon,
                        name: widget.name,
                        backgroundCSS: widget.backgroundCSS ?? null,
                        size: widget.size ?? null
                    });
                }
                else if (widget instanceof abstractInfo_1.default) {
                    widgets.push({
                        id: widget.ID,
                        type: widget.widgetType,
                        api: `${config.routePrefix}/widgets-info/${widget.ID}`,
                        description: widget.description,
                        icon: widget.icon,
                        name: widget.name,
                        backgroundCSS: widget.backgroundCSS ?? null,
                        size: widget.size ?? null
                    });
                }
                else if (widget instanceof abstractAction_1.default) {
                    widgets.push({
                        id: widget.ID,
                        type: widget.widgetType,
                        api: `${config.routePrefix}/widgets-action/${widget.ID}`,
                        description: widget.description,
                        icon: widget.icon,
                        name: widget.name,
                        backgroundCSS: widget.backgroundCSS ?? null,
                        size: widget.size ?? null
                    });
                }
                else if (widget instanceof abstractLink_1.default) {
                    let id_key = 0;
                    for (const link of widget.links) {
                        widgets.push({
                            name: link.name,
                            id: `${widget.ID}_${id_key}`,
                            type: 'link',
                            description: link.description,
                            link: link.link,
                            icon: link.icon,
                            backgroundCSS: link.backgroundCSS
                        });
                        id_key++;
                    }
                }
                else {
                    return;
                }
            }
        }
        return Promise.resolve(widgets);
    }
}
exports.WidgetHandler = WidgetHandler;
WidgetHandler.widgets = [];
async function getAllWidgets(req, res) {
    if (req.method.toUpperCase() === 'GET') {
        return res.json({ widgets: await WidgetHandler.getAll() });
    }
}
exports.getAllWidgets = getAllWidgets;
