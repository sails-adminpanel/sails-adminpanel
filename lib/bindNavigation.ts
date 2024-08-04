import {Navigation} from "./catalog/Navigation";
import {CatalogHandler} from "./catalog/CatalogHandler";


export default function bindNavigation() {
	sails.after(["hook:orm:loaded"], async () => {
		if (sails.config.adminpanel.navigation) {
			try {
				sails.config.adminpanel.navigation.model = sails.config.adminpanel.navigation.model ? sails.config.adminpanel.navigation.model : 'navigationap'
				let navigation = new Navigation(sails.config.adminpanel.navigation)
				CatalogHandler.add(navigation)
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
				}
			} catch (e) {
				console.log('bindNavigation Error: ', e)
			}
		}
	})
}
