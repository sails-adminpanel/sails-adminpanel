import { AbstractCatalog } from "./AbstractCatalog";

export class CatalogHandler {
	private static catalog: AbstractCatalog[] = [];

	public static add(catalog: AbstractCatalog) {
		this.catalog.push(catalog)
		return catalog
	}

	public static getAll() {
		return this.catalog;
	}

	public static getCatalog(slug: string) {
		return this.catalog.find((catalog) => catalog.slug === slug)
	}
}
