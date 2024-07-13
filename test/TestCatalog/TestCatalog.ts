import {AbstractCatalog, AbstractGroup, AbstractItem, ActionHandler, Item} from "../../lib/catalog/AbstractCatalog";
import * as fs from "node:fs";
import {data} from "autoprefixer";
const ejs = require('ejs')

const filepath = './.tmp/public/files'


interface GroupTestItem extends Item {
	thisIsGroup: boolean
}

/**
 * Storage takes place in RAM
 */
export class StorageService {
	private static storageMap: Map<string | number, GroupTestItem | Item> = new Map();

	public static async setElement(id: string | number, item: GroupTestItem | Item): Promise<GroupTestItem | Item> {
		this.storageMap.set(item.id, item);
		// This like fetch in DB
		return this.findElementById(item.id);
	}

	public static async removeElementById(id: string | number): Promise<void> {
		this.storageMap.delete(id);
	}

	public static async findElementById(id: string | number): Promise<GroupTestItem | Item | undefined> {
		return this.storageMap.get(id);
	}

	public static async findElementsByParentId(parentId: string | number, type: string): Promise<(GroupTestItem | Item)[]> {
		const elements: (GroupTestItem | Item)[] = [];
		for (const item of this.storageMap.values()) {
			// Assuming each item has a parentId property
			if (item.parentId === parentId && item.type === type) {
				elements.push(item);
			}
		}

		return elements;
	}

	public static async getAllElements(): Promise<(GroupTestItem | Item)[]> {
		return Array.from(this.storageMap.values());
	}


	public static async search(s: string, type: string): Promise<GroupTestItem[]> {
		const lowerCaseQuery = s.toLowerCase(); // Convert query to lowercase for case-insensitive search
		const matchedElements = [];

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


/**
 *
 _____         _    ____
|_   _|__  ___| |_ / ___|_ __ ___  _   _ _ __
  | |/ _ \/ __| __| |  _| '__/ _ \| | | | '_ \
  | |  __/\__ \ |_| |_| | | | (_) | |_| | |_) |
  |_|\___||___/\__|\____|_|  \___/ \__,_| .__/
                                        |_|
 */

export class TestGroup extends AbstractGroup<GroupTestItem> {
	public name: string = "Group";
	public allowedRoot: boolean = true;
	public icon = 'audio-description'
	public type = 'group'
	public isGroup: boolean = true;
	public readonly actionHandlers = []


	public async find(itemId: string | number) {
		return await StorageService.findElementById(itemId) as GroupTestItem;
	}


	public async update(itemId: string | number, data: GroupTestItem): Promise<GroupTestItem> {
		return await StorageService.setElement(itemId, data) as GroupTestItem;
	};

	public async create(itemId: string, data: GroupTestItem): Promise<GroupTestItem> {
		let elems = await StorageService.getAllElements()
		let id = elems.length + 1
		let newData = {
			...data,
			id: id.toString(),
			sortOrder: id
		}
		return await StorageService.setElement(id, newData) as GroupTestItem;
	}

	public async deleteItem(itemId: string | number) {
		await StorageService.removeElementById(itemId);
	}

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/groupAdd.ejs`, 'utf8')),
		}
	}

	public async getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		let type: 'html' = 'html'
		let item = await StorageService.findElementById(id)
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/groupEdit.ejs`, 'utf8'), { item: item }),
		}
	}

	public async getChilds(parentId: string | number): Promise<Item[]> {
		return await StorageService.findElementsByParentId(parentId, this.type);
	}

	public async search(s: string): Promise<GroupTestItem[]> {
		return await StorageService.search(s, this.type);
	}
}

/**
 ___ _                 _
|_ _| |_ ___ _ __ ___ / |
 | || __/ _ \ '_ ` _ \| |
 | || ||  __/ | | | | | |
|___|\__\___|_| |_| |_|_|
 */


export class Item2 extends AbstractItem<Item> {
	public type: string = "item2";
	public name: string = "Item 2";
	public allowedRoot: boolean = true;
	public icon: string = "radiation-alt";
	public readonly actionHandlers = []

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/item2Add.ejs`, 'utf8')),
		}
	}

	public async getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		let type: 'html' = 'html'
		let item = await StorageService.findElementById(id)
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/item2Edit.ejs`, 'utf8'), {item: item}),
		}
	}

	public async create(itemId: string, data: GroupTestItem): Promise<GroupTestItem> {
		let elems = await StorageService.getAllElements()
		let id = elems.length + 1
		let newData = {
			...data,
			id: id.toString(),
			sortOrder: id
		}
		return  await StorageService.setElement(id, newData) as GroupTestItem
	}


	public async find(itemId: string | number) {
		return await StorageService.findElementById(itemId);
	}

	public async update(itemId: string | number, data: Item): Promise<Item> {
		return await StorageService.setElement(itemId, data);
	};


	public async deleteItem(itemId: string | number) {
		await StorageService.removeElementById(itemId);
	}

	public async getChilds(parentId: string | number): Promise<Item[]> {
		return await StorageService.findElementsByParentId(parentId, this.type);
	}

	public async search(s: string): Promise<Item[]> {
		return await StorageService.search(s, this.type);
	}
}


export class Page extends AbstractItem<Item> {
	public type: string = "page";
	public name: string = "Page";
	public allowedRoot: boolean = true;
	public icon: string = "file";
	public readonly actionHandlers = []

	public async find(itemId: string | number) {
		return await sails.models['page'].findOne({id: itemId});
	}

	public async update(itemId: string | number, data: Item): Promise<Item> {
		// allowed only parentID update
		return await sails.models['page'].update({id: itemId}, { name: data.name, parentId: data.parentId}).fetch();
	};


	public async create(itemId: string, data: Item): Promise<Item> {
		throw `I dont know for what need it`
		// return await sails.models.create({ name: data.name, parentId: data.parentId}).fetch();
		// return await StorageService.setElement(itemId, data);
	}

	public async deleteItem(itemId: string | number) {
		await sails.models['page'].destroy({id: itemId})
	//	await StorageService.removeElementById(itemId);
	}

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'link' = 'link'
		return {
			type: type,
			data: '/admin/model/page/add?without_layout=true'
		}
	}


	public async getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		let type: 'link' = 'link'
		return {
			type: type,
			data: `/admin/model/page/edit/${id}?without_layout=true`
		}
	}
    // TODO: Need rename (getChilds) it not intuitive
	public async getChilds(parentId: string | number): Promise<Item[]> {
		return await sails.models['page'].find({parentID: parentId});
	}

	public async search(s: string): Promise<Item[]> {
		return await sails.models['page'].find({name: { contain: s}});
	}
}

export class TestCatalog extends AbstractCatalog {
	public readonly name: string = "test catalog";
	public readonly slug: string = "test";
	public readonly maxNestingDepth: number = null;
	public readonly icon: string = "box";
	public readonly actionHandlers = []

	//  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];

	constructor() {
		super([
			new TestGroup(),
			new Item2(),
			new Page()
		]);
		this.addActionHandler(new Link())
		this.addActionHandler(new ContextAction())
	}
}

export class Link extends ActionHandler {
	readonly icon: string = 'cat';
	readonly id: string = 'download';
	readonly name: string = 'Link';
	public readonly displayTool: boolean = true
	public readonly displayContext: boolean = false
	public readonly type = 'link'
	public readonly selectedItemTypes: string[] = []

	getLink(): Promise<string> {
		return Promise.resolve("");
	}

	getPopUpHTML(): Promise<string> {
		return Promise.resolve("");
	}

	handler(items: Item[], config?: any): Promise<any> {
		return Promise.resolve({
			data: 'http://www.example.com/',
			type: this.type
		});
	}

}
export class ContextAction extends ActionHandler{
	readonly icon: string = 'crow';
	readonly id: string = 'context1';
	readonly name: string = 'Rename';
	public readonly displayTool: boolean = false
	public readonly displayContext: boolean = true
	public readonly type = 'basic'
	public readonly selectedItemTypes: string[] = [
		'group',
		'item2'
	]

	getLink(): Promise<string> {
		return Promise.resolve("");
	}

	getPopUpHTML(): Promise<string> {
		return Promise.resolve("");
	}

	handler(items: Item[], config?: any): Promise<any> {
		const generateRandomString = () => {
			return Math.floor(Math.random() * Date.now()).toString(36);
		};
		setTimeout(async ()=>{
			for (const item of items) {
				let data = item
				data.name = generateRandomString()
				await StorageService.setElement(item.id, data)
			}
		}, 10000)
		return Promise.resolve({
			data: 'ok',
			type: this.type
		})
	}
}
