"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractWidgetBase_1 = require("./abstractWidgetBase");
class ActionBase extends abstractWidgetBase_1.default {
    constructor() {
        super(...arguments);
        this.widgetType = "action";
    }
}
exports.default = ActionBase;
