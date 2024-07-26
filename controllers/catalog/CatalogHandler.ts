import {AbstractCatalog} from "../../lib/catalog/abstractCatalog";

export class CatalogHandler {
	private static catalog: AbstractCatalog[] = [];

	public static add(catalog: AbstractCatalog) {
		this.catalog.push(catalog)
		return catalog
	}

	public static getAll(){
		let catalog = []
		let config = sails.config.adminpanel;
		if (this.catalog.length) {
			for (const catItem of this.catalog) {
				catalog.push({
					id: catItem.id
				})
			}
		}
		return Promise.resolve(catalog)
	}

	public static getCatalog(slug:string){
		return this.catalog.find((catalog) => catalog.slug === slug)
	}
}
