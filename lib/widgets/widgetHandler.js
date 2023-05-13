"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetHandler = void 0;
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
}
WidgetHandler.widgets = [];
exports.WidgetHandler = WidgetHandler;
