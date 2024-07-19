import {AbstractCatalog, AbstractGroup, AbstractItem, Item} from "./AbstractCatalog";
import {NavigationConfig} from "../../interfaces/adminpanelConfig";

export class Navigation extends AbstractCatalog{
	readonly maxNestingDepth: number | null;
	readonly name: string = 'Navigation';
	readonly slug: string = 'navigation';
	public readonly icon: string = "box";
	public readonly actionHandlers = []
	constructor(config: NavigationConfig) {
		let items = []
		for (const configElement of config.items) {
			items.push(new NavigationItem(
				configElement.name,
				configElement.model
			))
		}
		items.push(new NavigationGroup(config.groupItem.name, config.groupItem.model))
		super(items);
	}
}

export class NavigationItem <T extends Item> extends AbstractItem<T>{
	readonly allowedRoot: boolean = true;
	readonly icon: string = 'align-justify';
	readonly name: string;
	readonly type: string;
	protected model: string;
	public readonly actionHandlers = []

	constructor(name: string, model: string) {
		super();
		this.name = name
		this.model = model.toLowerCase()
		this.type = model.toLowerCase()
	}

	async find(itemId: string | number): Promise<T> {
		console.log(itemId)
		return await sails.models[this.model].findOne({id: itemId});
	}

	create(catalogId: string, data: T): Promise<T> {
		console.log('create: ', catalogId, data)
		return Promise.resolve(undefined);
	}

	deleteItem(itemId: string | number): Promise<void> {
		return Promise.resolve(undefined);
	}


	getAddHTML(): { type: "link" | "html" | "jsonForm"; data: string } {
		let type: 'link' = 'link'
		return {
			type: type,
			data: `/admin/model/${this.model}/add?without_layout=true`
		}
	}

	getChilds(parentId: string | number | null): Promise<Item[]> {
		return Promise.resolve([]);
	}

	getEditHTML(id: string | number): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		return Promise.resolve({data: "", type: undefined});
	}

	search(s: string): Promise<T[]> {
		return Promise.resolve([]);
	}

	update(itemId: string | number, data: T): Promise<T> {
		return Promise.resolve(undefined);
	}

}

export class NavigationGroup<T extends Item > extends NavigationItem<T>{
	readonly icon: string = 'layer-group';
	public isGroup: boolean = true;

	constructor(name: string, model: string) {
		super(name, model)
	}
}
