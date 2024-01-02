"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractWidgetBase_1 = require("./abstractWidgetBase");
class ActionBase extends abstractWidgetBase_1.default {
    constructor() {
        super(...arguments);
        this.widgetType = "action";
        /** Widget background css (color, Image) */
        this.backgroundCSS = null;
        /** Widget size */
        this.size = null;
    }
}
exports.default = ActionBase;
