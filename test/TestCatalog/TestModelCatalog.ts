import {AbstractCatalog, AbstractGroup, AbstractItem, ActionHandler, Item} from "../../lib/catalog/AbstractCatalog";
import * as fs from "node:fs";
import {StorageService} from "./TestCatalog";
import {JSONSchema4} from "json-schema";

const ejs = require('ejs')


class BaseModelItem<T extends Item> extends AbstractItem<T> {
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
		// allowed only parentId update
		return await sails.models[this.model].update({id: itemId}, {name: data.name, parentId: data.parentId}).fetch();
	};

	create(catalogId: string, data: T): Promise<T> {
		return Promise.resolve(undefined);
	}

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


	public async getEditHTML(id: string | number, parenId?: string | number): Promise<{
		type: "link" | "html";
		data: string;
	}> {
		let type: 'link' = 'link'
		return {
			type: type,
			data: `/admin/model/${this.model}/edit/${id}?without_layout=true`
		}
	}

	// TODO: Need rename (getChilds) it not intuitive
	public async getChilds(parentId: string | number): Promise<Item[]> {
		if (parentId === null) parentId = ""
		// console.log(this.type, parentId, await sails.models[this.model].find({parentId: parentId}))
		return await sails.models[this.model].find({parentId: parentId});
	}

	public async search(s: string): Promise<T[]> {
		return await sails.models[this.model].find({name: {contains: s}});
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


export class ItemHTML extends AbstractItem<Item> {
	readonly allowedRoot: boolean = false;
	public name: string = 'ItemHTML'
	public icon = 'cat'
	public type = 'itemHTML'
	public readonly actionHandlers = []

	public getAddHTML(): { type: 'link' | 'html' | 'jsonForm', data: string } {
		let type: 'html' = 'html'
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/itemHMLAdd.ejs`, 'utf8')),
		}
	}

	public async getEditHTML(id: string | number): Promise<{ type: 'link' | 'html' | 'jsonForm', data: string }> {
		let type: 'html' = 'html'
		let item = await StorageService.findElementById(id)
		return {
			type: type,
			data: ejs.render(fs.readFileSync(`${__dirname}/itemHTMLEdit.ejs`, 'utf8'), {item: item}),
		}
	}

	public async create(itemId: string, data: Item): Promise<Item> {
		let elems = await StorageService.getAllElements()
		let id = elems.length + 1
		let newData = {
			...data,
			id: id.toString(),
			sortOrder: id,
			icon: this.icon
		}
		return await StorageService.setElement(id, newData) as Item
	}


	public async find(itemId: string | number) {
		return await StorageService.findElementById(itemId) as Item;
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

export class ItemJsonForm extends ItemHTML {
	readonly allowedRoot: boolean;
	public name: string = 'ItemJsonForm'
	public icon = 'radiation-alt'
	public type = 'itemJsonForm'

	public getAddHTML() {
		let type: 'jsonForm' = 'jsonForm'
		let schema = {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
				},
			}
		}
		let UISchema = {
			"type": "VerticalLayout",
			"elements": [
				{
					"type": "Control",
					"label": "Item JsonForm name",
					"scope": "#/properties/name"
				}
			]
		}
		let itemType = this.type
		return {
			type: type,
			data: JSON.stringify({schema: schema, UISchema: UISchema, type: itemType}),
		}
	}

	public async getEditHTML(id: string | number): Promise<{ type: 'link' | 'html' | 'jsonForm', data: string }> {
		let item = await this.find(id)
		let type: 'jsonForm' = 'jsonForm'
		let schema = {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
				},
				"id": {
					"type": "string"
				},
				"parentId": {
					"type": "string"
				}
			}
		}
		let UISchema = {
			"type": "VerticalLayout",
			"elements": [
				{
					"type": "Control",
					"label": "Item JsonForm name",
					"scope": "#/properties/name"
				},
				{
					"type": "Control",
					"scope": "#/properties/id",
					"rule": {
						"effect": "HIDE",
						"condition": {
							"scope": "#",
							"schema": {}
						}
					}
				},
				{
					"type": "Control",
					"scope": "#/properties/parentId",
					"rule": {
						"effect": "HIDE",
						"condition": {
							"scope": "#",
							"schema": {}
						}
					}
				}
			]
		}
		let data = {
			"name": item.name,
			"id": id,
			"parentId": item.parentId
		}
		let itemType = this.type
		return {
			type: type,
			data: JSON.stringify({schema: schema, UISchema: UISchema, type: itemType, data: data}),
		}
	}
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
			new Page(),
			new ItemHTML(),
			new ItemJsonForm()
		]);
		this.addActionHandler(new Link())
		this.addActionHandler(new ContextAction())
		this.addActionHandler(new HTMLAction())
		this.addActionHandler(new JsonFormAction())
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
		return Promise.resolve('https://www.example.com/');
	}

	getPopUpHTML(): Promise<string> {
		return Promise.resolve("");
	}

	handler(items: Item[], data?: any): Promise<any> {
		return Promise.resolve(undefined);
	}

	readonly jsonSchema: JSONSchema4;
	readonly uiSchema: any;

}

export class ContextAction extends ActionHandler {
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

	handler(items: Item[], data?: any): Promise<any> {
		console.log(items, data)
		const generateRandomString = () => {
			return Math.floor(Math.random() * Date.now()).toString(36);
		};
		setTimeout(async () => {
			for (const item of items) {
				let name = generateRandomString()
				await sails.models['group'].update({id: item.id}, {name: name})
			}
		}, 10000)
		return Promise.resolve(undefined)
	}

	readonly jsonSchema: JSONSchema4;
	readonly uiSchema: any;
}

export class HTMLAction extends ActionHandler {
	readonly icon: string = 'cat';
	readonly id: string = 'html_action';
	readonly name: string = 'HTMLAction';
	readonly jsonSchema: JSONSchema4;
	readonly uiSchema: any;
	public readonly displayTool: boolean = true
	public readonly displayContext: boolean = true
	public readonly type = 'external'
	public readonly selectedItemTypes: string[] = []

	getLink(): Promise<string> {
		return Promise.resolve("");
	}

	getPopUpHTML(): Promise<string> {
		return Promise.resolve(ejs.render(fs.readFileSync(`${__dirname}/actionHTML.ejs`, 'utf8')));
	}

	async handler(items: Item[], data?: any): Promise<any> {
		console.log('HTMLAction handler items: ', items)
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve({ok: true})
			}, 5000)
		})
	}
}

export class JsonFormAction extends ActionHandler {
	readonly icon: string = 'crow';
	readonly id: string = 'json-form';
	readonly jsonSchema: JSONSchema4 = {
		"type": "object",
		"properties": {
			"name": {
				"type": "string",
			},
			"secondName": {
				"type": "string"
			}
		}
	};
	readonly name: string = 'JsonFormAction';
	readonly uiSchema: any = {
		"type": "VerticalLayout",
		"elements": [
			{
				"type": "Control",
				"label": "First Name",
				"scope": "#/properties/name"
			},
			{
				"type": "Control",
				"label": "Second Name",
				"scope": "#/properties/secondName",
			}
		]
	};
	public readonly displayTool: boolean = true
	public readonly displayContext: boolean = false
	public readonly selectedItemTypes: string[] = []
	readonly type: "basic" | "json-forms" | "external" | "link" = 'json-forms';

	getLink(): Promise<string> {
		return Promise.resolve("");
	}

	getPopUpHTML(): Promise<string> {
		return Promise.resolve(JSON.stringify({schema: this.jsonSchema, UISchema: this.uiSchema}));
	}

	handler(items: Item[], data?: any): Promise<any> {
		console.log('JsonFormAction handler items: ', items)
		console.log('JsonFormAction handler data: ', data)
		return new Promise((resolve, reject) => {
			resolve({ok: true})
		})
	}


}
