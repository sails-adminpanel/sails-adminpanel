import {Navigation} from "./catalog/Navigation/Navigation";
import {CatalogHandler} from "./catalog/CatalogHandler";


export default async function bindNavigation() {
	if (sails.config.adminpanel.navigation) {
		let navigation = new Navigation(sails.config.adminpanel.navigation)
		CatalogHandler.add(navigation)
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
				fields:{
					tree: false,
					id: false,
				},
			},
			model: sails.config.adminpanel.navigation.model.toLowerCase(),
			remove: false,
			title: sails.config.adminpanel.navigation.model,
			tools: [],
			view: false
		}
	}
}
