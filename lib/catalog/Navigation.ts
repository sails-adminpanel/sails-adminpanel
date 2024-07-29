import {AbstractCatalog, AbstractGroup, AbstractItem, Item} from "./AbstractCatalog";
import {NavigationConfig} from "../../interfaces/adminpanelConfig";
import * as fs from "node:fs";
const ejs = require('ejs')
import {v4 as uuid} from "uuid";

interface NavItem extends Item {
	urlPath?: any;
	modelId?: string | number;
}


class StorageService {
	protected storageMap: Map<string | number,  NavItem> = new Map();
	protected id: string
	protected model: string
	constructor(id: string, model: string) {
		this.id = id
		this.model = model.toLowerCase()
		this.initModel()
	}

	protected initModel(){
		sails.models[this.model].findOrCreate({ label: this.id, }, { label: this.id, tree: [] })
			.exec(async(err: any, navigation: any, wasCreated: any)=> {
				if (err) { throw err}

				if(wasCreated) {
					sails.log(`Created a new navigation: ${this.id}`);
				}
				else {
					sails.log(`Found existing navigation: ${this.id}`);
					await this.populateFromTree(navigation.tree)
				}
			});
	}
	public getId(){
		return this.id
	}

	public async buildTree(): Promise<any> {
		const rootElements: NavItem[] = await this.findElementsByParentId(null, null);
		const buildSubTree = async (elements: NavItem[]): Promise<any[]> => {
			const tree = [];
			for (const element of elements) {
				const children = await this.findElementsByParentId(element.id, null);
				tree.push({
					...element,
					children: await buildSubTree(children)
				});
			}
			return tree;
		};

		let tree = await buildSubTree(rootElements);

		function sortTree(items: any[]) {
			items.sort((a, b) => a.sortOrder - b.sortOrder);

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.children) {
					sortTree(item.children);
				}
			}
		}
		sortTree(tree)
		return tree
	}


	public async populateFromTree(tree: any[]): Promise<void> {
		const traverseTree = async (node: any, parentId: string | number | null = null): Promise<void> => {
			const { children, ...itemData } = node;
			const item = { ...itemData, parentId } as NavItem;
			await this.setElement(item.id, item);

			if (children && children.length > 0) {
				for (const child of children) {
					await traverseTree(child, item.id);
				}
			}
		};

		for (const node of tree) {
			await traverseTree(node);
		}
	}


	public async setElement(id: string | number, item: NavItem): Promise<NavItem> {
		this.storageMap.set(item.id, item);
		await this.saveToDB()
		// This like fetch in DB
		return this.findElementById(item.id);
	}

	public async removeElementById(id: string | number): Promise<void> {
		this.storageMap.delete(id);
		await this.saveToDB()
	}

	public async findElementById(id: string | number): Promise< NavItem | undefined> {
		return this.storageMap.get(id);
	}

	public async findElementByModelId(id: string | number): Promise<NavItem[] | undefined> {
		const elements: NavItem[] = [];
		for (const item of this.storageMap.values()) {
			if( item.modelId === id){
				elements.push(item)
			}
		}
		return elements;
	}

	public async saveToDB(){
		let tree = await this.buildTree()
		try{
			await sails.models[this.model].update(
				{label: this.id},
				{tree: tree}
			)
		} catch (e){
			console.log(e)
			throw 'navigation model update error'
		}
	}

	public async findElementsByParentId(parentId: string | number, type: string | null): Promise<NavItem[]> {
		const elements: NavItem[] = [];
		for (const item of this.storageMap.values()) {
			// Assuming each item has a parentId property
			if(type === null && item.parentId === parentId){
				elements.push(item)
				continue
			}
			if (item.parentId === parentId && item.type === type) {
				elements.push(item);
			}
		}

		return elements;
	}

	public async getAllElements(): Promise<NavItem[]> {
		return Array.from(this.storageMap.values());
	}


	public async search(s: string, type: string): Promise<NavItem[]> {
		const lowerCaseQuery = s.toLowerCase(); // Convert query to lowercase for case-insensitive search
		const matchedElements: NavItem[] = [];

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
			StorageServices.add(new StorageService(section, config.model))
		}

		super(items);
	}
}

export class NavigationItem extends AbstractItem<NavItem>{
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

	async create(data: any, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)
		let storageData = null
		if(data._method === 'select'){
			let record = await sails.models[this.model].findOne({id: data.record})
			storageData = await this.dataPreparation({
				record: record,
				parentId: data.parentId
			}, catalogId)
		} else {
			storageData = await this.dataPreparation(data, catalogId)
		}
		return await storage.setElement(data.id, storageData) as NavItem;
	}

	protected async dataPreparation(data: any, catalogId: string, sortOrder?: number){
		let storage = StorageServices.get(catalogId)
		let urlPath = eval('`' + this.urlPath + '`')
		let parentId = data.parentId ? data.parentId : null
		return  {
			id: uuid(),
			modelId: data.record.id,
			name: data.record.name ?? data.record.title ?? data.record.id,
			parentId: parentId,
			sortOrder: sortOrder ?? (await storage.findElementsByParentId(parentId, null)).length,
			icon: this.icon,
			type: this.type,
			urlPath: urlPath
		}
	}

	async updateModelItems(itemId: string | number, data: any, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)
		let items = await storage.findElementByModelId(itemId)
		let urlPath = eval('`' + this.urlPath + '`')
		for (const item of items) {
			item.name = data.record.name
			item.urlPath = urlPath
			await storage.setElement(item.id, item);
		}
		return Promise.resolve(undefined)
	}

	async update(itemId: string | number, data: any, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)
		return await storage.setElement(itemId, data);
	}

	async deleteItem(itemId: string | number, catalogId: string): Promise<void> {
		let storage = StorageServices.get(catalogId)
		return await storage.removeElementById(itemId);
	}

	async find(itemId: string | number, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementById(itemId);
	}

	async getAddHTML(): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		let type: 'html' = 'html'
		let items = await sails.models[this.model].find()
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/itemHTMLAdd.ejs`, 'utf8'), {items: items, item:{name: this.name, type: this.type, model: this.model}}),
		}
	}

	async getChilds(parentId: string | number | null, catalogId: string): Promise<NavItem[]> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementsByParentId(parentId, this.type);
	}

	async getEditHTML(id: string | number): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		let type: 'link' = 'link'
		return Promise.resolve({
			type: type,
			data: `/admin/model/${this.model}/edit/${id}?without_layout=true`
		})
	}

	async search(s: string, catalogId: string): Promise<NavItem[]> {
		let storage = StorageServices.get(catalogId)
		return await storage.search(s, this.type);
	}


}

export class NavigationGroup extends AbstractGroup<NavItem>{
	readonly allowedRoot: boolean = true;
	readonly name: string = "Group";
	readonly groupField: string[]

	constructor(groupField: string[]) {
		super();
		this.groupField = groupField
	}
	async create(data: any, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)

		let storageData = await this.dataPreparation(data, catalogId)
		delete data.name
		delete data.parentId
		storageData = {...storageData, ...data}

		return await storage.setElement(storageData.id, storageData) as NavItem;
	}

	protected async dataPreparation(data: any, catalogId: string, sortOrder?: number){
		let storage = StorageServices.get(catalogId)
		let parentId = data.parentId ? data.parentId : null
		return  {
			id: uuid(),
			name: data.name,
			parentId: parentId,
			sortOrder: sortOrder ?? (await storage.findElementsByParentId(parentId, null)).length,
			icon: this.icon,
			type: this.type
		}
	}

	async deleteItem(itemId: string | number, catalogId: string): Promise<void> {
		let storage = StorageServices.get(catalogId)
		return await storage.removeElementById(itemId);
	}

	async find(itemId: string | number, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementById(itemId);
	}

	async update(itemId: string | number, data: any, catalogId: string): Promise<NavItem> {
		let storage = StorageServices.get(catalogId)
		return await storage.setElement(itemId, data);
	}

	updateModelItems(itemId: string | number, data: NavItem, catalogId: string): Promise<NavItem> {
		return Promise.resolve(undefined);
	}

	getAddHTML(): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		let type: 'html' = 'html'
		return Promise.resolve({
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/GroupHTMLAdd.ejs`, 'utf8'), {fields: this.groupField}),
		})
	}

	async getChilds(parentId: string | number | null, catalogId: string): Promise<NavItem[]> {
		let storage = StorageServices.get(catalogId)
		return await storage.findElementsByParentId(parentId, this.type);
	}

	async getEditHTML(id: string | number, catalogId: string): Promise<{ type: "link" | "html" | "jsonForm"; data: string }> {
		let type: 'html' = 'html'
		let item = await this.find(id, catalogId)
		return Promise.resolve({
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/GroupHTMLEdit.ejs`, 'utf8'), {fields: this.groupField, item: item}),
		})
	}

	async search(s: string, catalogId: string): Promise<NavItem[]> {
		let storage = StorageServices.get(catalogId)
		return await storage.search(s, this.type);
	}


}


export async function createTestData() {
	const group1: NavItem = {
		id: '1',
		name: 'Group 1',
		parentId: null,
		sortOrder: 1,
		icon: 'folder',
		type: 'group',
	};

	const group2: NavItem = {
		id: '2',
		name: 'Group 2',
		parentId: null,
		sortOrder: 2,
		icon: 'folder',
		type: 'group',
	};

	const group3: NavItem = {
		id: '3',
		name: 'Group 3',
		parentId: null,
		sortOrder: 3,
		icon: 'folder',
		type: 'group',
	};

	const groups = [group1, group2, group3];
	let storage = StorageServices.get('header')
	for (let i = 0; i < groups.length; i++) {
		for (let j = 1; j <= 2; j++) {
			const subGroup: NavItem = {
				id: `${groups[i].id}.${j}`,
				name: `Group ${groups[i].id}.${j}`,
				parentId: groups[i].id,
				sortOrder: j,
				icon: 'folder',
				type: 'group',
			};

			for (let k = 1; k <= 3; k++) {
				const item: NavItem = {
					id: `${groups[i].id}.${j}.${k}`,
					name: `NavItem ${groups[i].id}.${j}.${k}`,
					parentId: subGroup.id,
					sortOrder: k,
					icon: 'file',
					type: 'page'
				};
				await storage.setElement(item.id, item);
			}

			await storage.setElement(subGroup.id, subGroup);
		}

		await storage.setElement(groups[i].id, groups[i]);
	}
}
