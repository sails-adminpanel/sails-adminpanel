import {AbstractCatalog, ActionHandler, AbstractGroup, AbstractItem, Item} from "../../lib/catalog/AbstractCatalog";
import * as fs from "node:fs";

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
			id: id.toString(),
			sortOrder: id
		}
		let item = await StorageService.setElement(id, newData) as GroupTestItem
		if (item.parentId !== null) {
			let parent = await StorageService.findElementById(item.parentId)
			parent.childs.push(item)
		}
		return item;
	}

	public async deleteItem(itemId: string | number) {
		await StorageService.removeElementById(itemId);
	}

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: fs.readFileSync(`${__dirname}/groupAdd.html`, 'utf8'),
		}
	}

	public async getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		let type: 'html' = 'html'
		let item = await StorageService.findElementById(id)
		return {
			type: type,
			data: `<div class="custom-catalog__form">
					<div class="flex flex-col gap-3">
					<div class="admin-panel__wrapper-title">
					<label class="admin-panel__title" for="form-title">Title for Group</label>
					</div>
					<div class="admin-panel__widget">
					<div class="widget_narrow ">
					<input class="text-input w-full" type="text" placeholder="Title" value="${item.name}" name="title"
					id="group-form-title" required/>
					</div>
					</div>
					</div>
					<div>
					<button class="btn btn-green" id="save-group">
					Save
					</button>
					</div>
					</div>
					<script>
					{
						let btn = document.getElementById('save-group')
						let item = ${JSON.stringify(item)}
						btn.addEventListener('click', async function () {
							item.name = document.getElementById('group-form-title').value
							let res = await ky.put('', {json: {type: item.type, data: item, id: item.id, _method: 'updateItem'}}).json()
							if (res.data) document.getElementById('checkbox-ready').click()
						})
					}
					</script>`,
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

	public async deleteItem(itemId: string | number) {
		await StorageService.removeElementById(itemId);
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

	public async getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		let type: 'html' = 'html'
		let item = await StorageService.findElementById(id)
		return {
			type: type,
			data: `<div class="custom-catalog__form">
					<div class="flex flex-col gap-3">
					<div class="admin-panel__wrapper-title">
					<label class="admin-panel__title" for="form-title">Title for Item2</label>
					</div>
					<div class="admin-panel__widget">
					<div class="widget_narrow ">
					<input class="text-input w-full" type="text" placeholder="Title" value="${item.name}" name="title"
					id="group-form-title" required/>
					</div>
					</div>
					</div>
					<div>
					<button class="btn btn-green" id="save-group">
					Save
					</button>
					</div>
					</div>
					<script>
					{
						let btn = document.getElementById('save-group')
						let item = ${JSON.stringify(item)}
						btn.addEventListener('click', async function () {
							item.name = document.getElementById('group-form-title').value
							let res = await ky.put('', {json: {type: item.type, data: item, id: item.id, _method: 'updateItem'}}).json()
							if (res.data) document.getElementById('checkbox-ready').click()
						})
					}
					</script>`,
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
		let item = await StorageService.setElement(id, newData) as GroupTestItem
		if (item.parentId !== null) {
			let parent = await StorageService.findElementById(item.parentId)
			parent.childs.push(item)
		}
		return item;
	}


	public async update(itemId: string | number, data: Item): Promise<Item> {
		return await StorageService.setElement(itemId, data);
	};
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
			new Item1(),
			new Item2()
		]);
		this.addActionHandler(new DownloadTree())
	}
}

export class DownloadTree extends ActionHandler {
	readonly icon: string = 'cat';
	readonly id: string = 'download';
	readonly name: string = 'Download Items';
	public readonly displayTool: boolean = true
	public readonly displayContext: boolean = false
	public readonly type = 'basic'
	public readonly selectedItemTypes: string[] = []

	getLink(): Promise<string> {
		return Promise.resolve("");
	}

	getPopUpHTML(): Promise<string> {
		return Promise.resolve("");
	}

	handler(items: Item[], config?: any): Promise<any> {
		let date = new Date().valueOf()

		if (fs.existsSync(`${filepath}`)) {
			fs.rmSync(`${filepath}`, { recursive: true, force: true });
			fs.mkdirSync(`${filepath}`, { recursive: true });
		} else{
			fs.mkdirSync(`${filepath}`, { recursive: true });
		}


		fs.writeFileSync(`${filepath}/${date}.json`, JSON.stringify(items, null, 2));

		// // zip archive of your folder is ready to download
		// res.download(folderpath + '/archive.zip');

		return Promise.resolve({
			data: `files/${date}.json`,
			type: this.type,
			event: 'download'
		});
	}

}
