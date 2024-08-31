"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractWidgetBase_1 = require("./abstractWidgetBase");
class LinkBase extends abstractWidgetBase_1.default {
    constructor() {
        super(...arguments);
        this.widgetType = "link";
    }
}
exports.default = LinkBase;
