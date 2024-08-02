"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("./catalog/Navigation/Navigation");
const CatalogHandler_1 = require("./catalog/CatalogHandler");
async function bindNavigation() {
    if (sails.config.adminpanel.navigation) {
        let navigation = new Navigation_1.Navigation(sails.config.adminpanel.navigation);
        CatalogHandler_1.CatalogHandler.add(navigation);
        sails.config.adminpanel.models[sails.config.adminpanel.navigation.model.toLowerCase()] = {
            add: false,
            edit: {
                controller: '../lib/catalog/Navigation/edit',
            },
            fields: {
                createdAt: false,
                updatedAt: false
            },
            hide: false,
            icon: 'layer-group',
            identifierField: "",
            list: {
                fields: {
                    tree: false,
                    id: false,
                },
            },
            model: sails.config.adminpanel.navigation.model.toLowerCase(),
            remove: false,
            title: sails.config.adminpanel.navigation.model,
            tools: [],
            view: false
        };
    }
}
exports.default = bindNavigation;
