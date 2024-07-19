"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("./catalog/Navigation");
const CatalogHandler_1 = require("./catalog/CatalogHandler");
async function bindNavigation() {
    // for (let form in sails.config.adminpanel.forms.data) {
    // 	for (let key in sails.config.adminpanel.forms.data[form]) {
    // 		if (await sails.config.adminpanel.forms.get(form, key) === undefined){
    // 			await sails.config.adminpanel.forms.set(form, key, sails.config.adminpanel.forms.data[form][key].value);
    // 		}
    // 	}
    // }
    let navigation = new Navigation_1.Navigation(sails.config.adminpanel.navigation);
    CatalogHandler_1.CatalogHandler.add(navigation);
}
exports.default = bindNavigation;
