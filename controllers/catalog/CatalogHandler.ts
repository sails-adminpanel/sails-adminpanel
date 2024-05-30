import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import {Model} from "waterline";
import UserAP from "../../models/UserAP";
import {WidgetConfig} from "../../lib/widgets/widgetHandler";

type CatalogType = {
	slug: string
}

export class CatalogHandler {
	private static catalog: CatalogType[] = [];

	public static add(catalog: CatalogType): void {
		this.catalog.push(catalog)
	}

	public static getAll(user: UserAP){
		let catalog = []
		let config = sails.config.adminpanel;
		if (this.catalog.length) {
			for (const catItem of this.catalog) {
				catalog.push({
					api: `${config.routePrefix}/catalog/${catItem.slug}`,
				})
			}
		}
		return Promise.resolve(catalog)
	}
}
