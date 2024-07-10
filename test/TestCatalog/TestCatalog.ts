import {AbstractCatalog, ActionHandler, AbstractGroup, AbstractItem, Item} from "../../lib/catalog/AbstractCatalog";
import * as fs from "node:fs";

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
		return  this.storageMap.get(id);
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
	public icon: string;


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
			id: id,
			sortOrder: id
		}
		let item = await StorageService.setElement(id, newData) as GroupTestItem
		if(item.parentId !== null) {
			let parent = await StorageService.findElementById(item.parentId)
			parent.childs.push(item)
		}
		return item;
	}

	public async deleteItem(itemId: string | number): Promise<void> {
		return await StorageService.removeElementById(itemId);
	}

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: fs.readFileSync(`${__dirname}/groupAdd.html`, 'utf8'),
		}
	}

	public getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		throw new Error("Method not implemented.");
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

export class Item1 extends AbstractItem<Item> {
	public type: string = "item1";
	public name: string = "Item 1";
	public allowedRoot: boolean = true;
	public icon: string = "file";

	public async find(itemId: string | number) {
		return await StorageService.findElementById(itemId);
	}

	public async update(itemId: string | number, data: Item): Promise<Item> {
		return await StorageService.setElement(itemId, data);
	};


	public async create(itemId: string, data: Item): Promise<Item> {
		return await StorageService.setElement(itemId, data);
	}

	public async deleteItem(itemId: string | number): Promise<void> {
		return await StorageService.removeElementById(itemId);
	}

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'link' = 'link'
		return {
			type: type,
			data: '/admin/model/page/add?without_layout=true'
		}
	}

	public getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		throw new Error("Method not implemented.");
	}

	public async getChilds(parentId: string | number): Promise<Item[]> {
		return await StorageService.findElementsByParentId(parentId, this.type);
	}

	public async search(s: string): Promise<Item[]> {
		return await StorageService.search(s, this.type);
	}
}


export class Item2 extends Item1 {
	public type: string = "item2";
	public name: string = "Item 2";
	public allowedRoot: boolean = true;
	public icon: string = "file";

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: fs.readFileSync(`${__dirname}/item2Add.html`, 'utf8'),
		}
	}

	public async create(itemId: string, data: GroupTestItem): Promise<GroupTestItem> {
		let elems = await StorageService.getAllElements()
		let id = elems.length + 1
		let newData = {
			...data,
			id: id,
			sortOrder: id
		}
		return await StorageService.setElement(id, newData) as GroupTestItem;
	}
}

export class TestCatalog extends AbstractCatalog {
	public readonly name: string = "test catalog";
	public readonly slug: string = "test";
	public readonly maxNestingDepth: number = null;
	public readonly icon: string = "box";

	//  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];

	constructor() {
		super([
			new TestGroup(),
			new Item1(),
			new Item2()
		]);
	}
}
