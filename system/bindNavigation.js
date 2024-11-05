"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindNavigation;
const Navigation_1 = require("../lib/catalog/Navigation");
const CatalogHandler_1 = require("../lib/catalog/CatalogHandler");
function bindNavigation() {
    sails.after(["hook:orm:loaded"], async () => {
        if (sails.config.adminpanel.navigation) {
            try {
                sails.config.adminpanel.navigation.model = sails.config.adminpanel.navigation.model ? sails.config.adminpanel.navigation.model : 'navigationap';
                let navigation = new Navigation_1.Navigation(sails.config.adminpanel.navigation);
                CatalogHandler_1.CatalogHandler.add(navigation);
                sails.config.adminpanel.models[sails.config.adminpanel.navigation.model.toLowerCase()] = {
                    add: false,
                    edit: {
                        controller: '../controllers/navigation/edit',
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
            catch (e) {
                console.log('bindNavigation Error: ', e);
            }
        }
    });
}
