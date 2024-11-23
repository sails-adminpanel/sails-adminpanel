import {Navigation} from "../lib/catalog/Navigation";
import {CatalogHandler} from "../lib/catalog/CatalogHandler";

export default function bindNavigation() {
	sails.after(["hook:orm:loaded"], async () => {
		if (adminizer.config.navigation) {
			try {
				adminizer.config.navigation.model = adminizer.config.navigation.model ? adminizer.config.navigation.model : 'navigationap'
				let navigation = new Navigation(adminizer.config.navigation)
				CatalogHandler.add(navigation)
				adminizer.config.models[adminizer.config.navigation.model.toLowerCase()] = {
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
					model: adminizer.config.navigation.model.toLowerCase(),
					remove: false,
					title: adminizer.config.navigation.model,
					tools: [],
					view: false
				}
			} catch (e) {
				console.log('bindNavigation Error: ', e)
			}
		}
	})
}
