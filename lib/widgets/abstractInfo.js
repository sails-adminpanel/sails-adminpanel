"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractWidgetBase_1 = require("./abstractWidgetBase");
class InfoBase extends abstractWidgetBase_1.default {
    constructor() {
        super(...arguments);
        /** Widget size */
        this.size = null;
    }
}
exports.default = InfoBase;
