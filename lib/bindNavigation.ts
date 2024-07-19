import {Navigation} from "./catalog/Navigation";
import {CatalogHandler} from "./catalog/CatalogHandler";

export default async function bindNavigation() {
	// for (let form in sails.config.adminpanel.forms.data) {
	// 	for (let key in sails.config.adminpanel.forms.data[form]) {
	// 		if (await sails.config.adminpanel.forms.get(form, key) === undefined){
	// 			await sails.config.adminpanel.forms.set(form, key, sails.config.adminpanel.forms.data[form][key].value);
	// 		}
	// 	}
	// }
	let navigation = new Navigation(sails.config.adminpanel.navigation)
	CatalogHandler.add(navigation)
}
