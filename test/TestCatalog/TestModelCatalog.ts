import {AbstractCatalog, AbstractGroup, AbstractItem, ActionHandler, Item} from "../../lib/catalog/AbstractCatalog";
import * as fs from "node:fs";
import {data} from "autoprefixer";
const ejs = require('ejs')

interface GroupTestItem extends Item {
	thisIsGroup: boolean
}


class BaseModelItem<T extends Item>  extends AbstractItem<T> {
	public type: string = "page";
	public name: string = "Page";
	public allowedRoot: boolean = true;
	public icon: string = "file";
	public model: string = null;
	
	public readonly actionHandlers = []

	public async find(itemId: string | number) {
		return await sails.models[this.model].findOne({id: itemId});
	}

	public async update(itemId: string | number, data: Item): Promise<T> {
		// allowed only parentID update
		return await sails.models[this.model].update({id: itemId}, { name: data.name, parentId: data.parentId}).fetch();
	};


	// public async create(itemId: string, data: Item): Promise<Item> {
	// 	throw `I dont know for what need it`
	// 	// return await sails.models.create({ name: data.name, parentId: data.parentId}).fetch();
	// 	// return await StorageService.setElement(itemId, data);
	// }

	public async deleteItem(itemId: string | number) {
		await sails.models[this.model].destroy({id: itemId})
	//	await StorageService.removeElementById(itemId);
	}

	public getAddHTML(): { type: "link" | "html"; data: string; } {
		let type: 'link' = 'link'
		return {
			type: type,
			data: `/admin/model/${this.model}/add?without_layout=true`
		}
	}


	public async getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
		let type: 'link' = 'link'
		return {
			type: type,
			data: `/admin/model/${this.model}/edit/${id}?without_layout=true`
		}
	}
    // TODO: Need rename (getChilds) it not intuitive
	public async getChilds(parentId: string | number): Promise<Item[]> {
		return await sails.models[this.model].find({parentID: parentId});
	}

	public async search(s: string): Promise<T[]> {
		return await sails.models[this.model].find({name: { contain: s}});
	}
}


export class ModelGroup<GroupTestItem extends Item> extends BaseModelItem<GroupTestItem> {
	public name: string = "Group";
	public allowedRoot: boolean = true;
	public icon = 'audio-description'
	public type = 'group'
	public isGroup: boolean = true;
	public model: string = "group";
	public readonly actionHandlers = []

}

export class Page<T extends Item> extends BaseModelItem<T> {
	public name: string = "Page";
	public allowedRoot: boolean = true;
	public icon = 'file'
	public type = 'page'
	public model: string = "page";
	public readonly actionHandlers = []

}


export class TestModelCatalog extends AbstractCatalog {
	public readonly name: string = "test model catalog";
	public readonly slug: string = "testModel";
	public readonly maxNestingDepth: number = null;
	public readonly icon: string = "box";
	public readonly actionHandlers = []

	//  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];

	constructor() {
		super([
			new ModelGroup(),
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
		'group'
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
				console.log("await StorageService.setElement(item.id, data) <<<")
			}
		}, 10000)
		return Promise.resolve({
			data: 'ok',
			type: this.type
		})
	}
}
