"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("./catalog/Navigation/Navigation");
const CatalogHandler_1 = require("./catalog/CatalogHandler");
async function bindNavigation() {
    if (sails.config.adminpanel.navigation) {
        let navigation = new Navigation_1.Navigation(sails.config.adminpanel.navigation);
        CatalogHandler_1.CatalogHandler.add(navigation);
    }
}
exports.default = bindNavigation;
