import {AbstractCatalog, AbstractGroup, AbstractItem, Item} from "./AbstractCatalog";
import {NavigationConfig} from "../../interfaces/adminpanelConfig";
import * as fs from "node:fs";
const ejs = require('ejs')
import {v4 as uuid} from "uuid";

class StorageService {
	protected storageMap: Map<string | number,  Item> = new Map();
	protected id: string

	constructor(id: string) {
		this.id = id
	}

	public getId(){
		return this.id
	}

	public async setElement(id: string | number, item: Item): Promise<Item> {
		this.storageMap.set(item.id, item);
		// This like fetch in DB
		return this.findElementById(item.id);
	}

	public async removeElementById(id: string | number): Promise<void> {
		this.storageMap.delete(id);
	}

	public async findElementById(id: string | number): Promise< Item | undefined> {
		return this.storageMap.get(id);
	}

	public async findElementsByParentId(parentId: string | number, type: string): Promise<Item[]> {
		const elements: Item[] = [];
		for (const item of this.storageMap.values()) {
			// Assuming each item has a parentId property
			if (item.parentId === parentId && item.type === type) {
				elements.push(item);
			}
		}

		return elements;
	}

	public async getAllElements(): Promise<Item[]> {
		return Array.from(this.storageMap.values());
	}


	public async search(s: string, type: string): Promise<Item[]> {
		const lowerCaseQuery = s.toLowerCase(); // Convert query to lowercase for case-insensitive search
		const matchedElements: Item[] = [];

		for (const item of this.storageMap.values()) {
			// Check if item type matches the specified type
			if (item.type === type) {
				// Search by name
				if (item.name.toLowerCase().includes(lowerCaseQuery)) {
					matchedElements.push(item);
				}
			}
		}

		return matchedElements;
	}
}

class StorageServices{
	protected static storages: StorageService[] = []
	public static add(storage: StorageService){
		this.storages.push(storage)
	}
	public static get(id: string){
		return this.storages.find(storage => storage.getId() === id)
	}
}

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
				configElement.model,
				config.model,
				configElement.urlPath
			))
		}
		items.push(new NavigationGroup(config.groupField))

		for (const section of config.sections) {
			StorageServices.add(new StorageService(section))
		}

		super(items);
	}
}

export class NavigationItem extends AbstractItem<Item>{
	readonly allowedRoot: boolean = true;
	readonly icon: string = 'file';
	readonly name: string;
	readonly type: string;
	protected model: string;
	protected navigationModel: string;
	public readonly actionHandlers = []
	public readonly urlPath: any;

	constructor(name: string, model: string, navigationModel:string, urlPath:any) {
		super();
		this.name = name
		this.navigationModel = navigationModel
		this.model = model.toLowerCase()
		this.type = model.toLowerCase()
		this.urlPath = urlPath
	}

	async create(data: any, catalogId: string): Promise<Item> {
		let storage = StorageServices.get(catalogId)

		let urlPath = eval('`' + this.urlPath + '`')

		let storageData = {
			id: data.record.id,
			name: data.record.name ?? data.record.title ?? data.record.id,
			parentId: data.parentId ? data.parentId : null,
			sortOrder: 0,
			icon: this.icon,
			type: this.type,
			urlPath: urlPath
		}
		return await storage.setElement(data.id, storageData) as Item;
	}

	deleteItem(itemId: string | number, catalogId: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	async find(itemId: string | number, catalogId: string): Promise<Item> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementById(itemId);
	}

	getAddHTML(): { type: "link" | "html" | "jsonForm"; data: string } {
		let type: 'link' = 'link'
		return {
			type: type,
			data: `/admin/model/${this.model}/add?without_layout=true`
		}
	}

	async getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementsByParentId(parentId, this.type);
	}

	getEditHTML(id: string | number): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		return Promise.resolve({data: "", type: undefined});
	}

	search(s: string, catalogId: string): Promise<Item[]> {
		return Promise.resolve([]);
	}

	update(itemId: string | number, data: any, catalogId: string): Promise<Item> {
		return Promise.resolve(undefined);
	}

}

export class NavigationGroup extends AbstractGroup<Item>{
	readonly allowedRoot: boolean = true;
	readonly name: string = "Group";
	readonly groupField: string[]

	constructor(groupField: string[]) {
		super();
		this.groupField = groupField
	}
	async create(data: any, catalogId: string): Promise<Item> {
		let storage = StorageServices.get(catalogId)

		let storageData = {
			id: uuid(),
			name: data.name,
			parentId: data.parentId ? data.parentId : null,
			sortOrder: 0,
			icon: this.icon,
			type: this.type
		}
		delete data.name
		delete data.parentId
		storageData = {...storageData, ...data}

		return await storage.setElement(storageData.id, storageData) as Item;
	}

	deleteItem(itemId: string | number, catalogId: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	find(itemId: string | number, catalogId: string): Promise<Item> {
		return Promise.resolve(undefined);
	}

	getAddHTML(): { type: "link" | "html" | "jsonForm"; data: string } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/GroupHTMLAdd.ejs`, 'utf8'), {fields: this.groupField}),
		}
	}

	async getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementsByParentId(parentId, this.type);
	}

	getEditHTML(id: string | number): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		return Promise.resolve({data: "", type: undefined});
	}

	search(s: string, catalogId: string): Promise<Item[]> {
		return Promise.resolve([]);
	}

	update(itemId: string | number, data: any, catalogId: string): Promise<Item> {
		return Promise.resolve(undefined);
	}



}
