import {Navigation} from "./catalog/Navigation/Navigation";
import {CatalogHandler} from "./catalog/CatalogHandler";


export default async function bindNavigation() {
	if (sails.config.adminpanel.navigation) {
		let navigation = new Navigation(sails.config.adminpanel.navigation)
		CatalogHandler.add(navigation)
	}
}
