import {JSONSchema4} from "json-schema";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

/**
 * Interface `Item` describes the data that the UI will operate on
 * This is a common interface for all data that is linked to the catalog
 * This data will also be sent to crud Item
 * */
export interface Item {
	id: string | number;
	name: string;
	parentId: string | number | null;
	childs?: Item[];
	sortOrder: number

	// below: AbstractGroup layer - It means data to be mapped from itemType class
	icon: string
	type: string;

	// below: service marks for Frontend Component
	marked?: boolean
}

export type _Item_ = {
	[key: string]: boolean | string | number | object;
};

/**
 * General Item structure that will be available for all elements, including groups
 *
 *
 */
export abstract class BaseItem<T extends Item> {
	// public abstract readonly id: string;
	public abstract readonly type: string;

	/**
	 * Used for infer T
	 * I haven't found an easier way to extract this type that goes into generic
	 * If you know how to open PR
	 * */
	// public readonly dataType: T

	/**
	 * Catalog name
	 */
	public abstract readonly name: string;
	/**
	 * A sign that this is a group
	 */
	public abstract readonly isGroup: boolean;

	/**
	 * Is it allowed or not to add an element to the root
	 */
	public abstract readonly allowedRoot: boolean

	/**
	 *  icon (url or id)
	 */
	public abstract readonly icon: string;

	/**
	 * Array of all global contexts, which will appear for all elements
	 */
	public readonly actionHandlers: ActionHandler[]

	public addActionHandler(contextHandler: ActionHandler) {
		this.actionHandlers.push(contextHandler);
	}

	/**
	 * Adds the required fields
	 * @param item
	 */
	public _enrich(item: T): void {
		item.icon = this.icon;
		item.type = this.type;
	}

	public async _find(itemId: string | number, catalogId: string): Promise<T> {
		let item = await this.find(itemId, catalogId);
		this._enrich(item);
		return item;
	}

	public abstract find(itemId: string | number, catalogId: string): Promise<T>;

	/**
	 * Is false because default value Group is added
	 */
	public abstract update(itemId: string | number, data: T, catalogId: string): Promise<T>;

	/**
	 *
	 * @param itemId
	 * @param data
	 * @param catalogId
	 */
	public abstract updateModelItems(modelId: string | number, data: any, catalogId: string): Promise<T>;

	/**
	 * For custom HTML
	 * @param itemId
	 * @param data
	 */
	public abstract create(data: T, catalogId: string): Promise<T>;

	/**
	 *  delete element
	 */
	public abstract deleteItem(itemId: string | number, catalogId: string): Promise<void>;


	public abstract getAddHTML(loc: string): Promise<{ type: 'link' | 'html' | 'jsonForm', data: string }>

	public abstract getEditHTML(id: string | number, catalogId: string, loc: string, modelId?: string | number): Promise<{
		type: 'link' | 'html' | 'jsonForm',
		data: string
	}>;

	public async _getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]> {
		let items = await this.getChilds(parentId, catalogId)
		items.forEach((item) => {
			this._enrich(item as T)
		})
		return items;
	}

	public abstract getChilds(parentId: string | number | null, catalogId: string): Promise<Item[]>

	public abstract search(s: string, catalogId: string): Promise<T[]>
}


export abstract class AbstractGroup<T extends Item> extends BaseItem<T> {

	// public abstract create(itemId: string, data: T): Promise<T>;

	public readonly type: string = "group";
	public readonly isGroup: boolean = true;
	public icon: string = "folder";
}

export abstract class AbstractItem<T extends Item> extends BaseItem<T> {
	public readonly isGroup: boolean = false;
}

/// ContextHandler
export abstract class ActionHandler {
	/**
	 * Three actions are possible, without configuration, configuration via pop-up, and just external action
	 * For the first two, a handler is provided, but the third type of action simply calls the HTML in the popup; the controller will be implemented externally
	 * */
	public abstract readonly type: "basic" |
		"json-forms" |
		"external" |
		"link" |
		"partial"

	/**
	 * Will be shown in the context menu section
	 */
	public abstract readonly displayContext: boolean
	/**
	 * Will be shown in the toolbox section
	 */
	public abstract readonly displayTool: boolean

	/** (!*1)
	 * Only for json-forms
	 * ref: https://jsonforms.io/docs
	 */
	public abstract readonly uiSchema: any
	public abstract readonly jsonSchema: JSONSchema4

	/**
	 * For "json-forms" | "external"
	 */
	public abstract getPopUpHTML(data?: any): Promise<string>


	/**
	 * Only for link type
	 */
	public abstract getLink(data?: any): Promise<string>


	/**
	 * For which elements the action can be used
	 */
	public readonly selectedItemTypes: string[]

	/**
	 * icon (url or id)
	 */
	public abstract readonly id: string;

	public abstract readonly icon: string;

	public abstract readonly name: string

	/**
	 * Implementation of a method that will do something with elements.
	 * there's really not much you can do with the context menu
	 * @param items
	 * @param config
	 */
	public abstract handler(items: Item[], data?: any): Promise<void>;

}

/**
 *
	Abstract
   ____    _  _____  _    _     ___   ____
  / ___|  / \|_   _|/ \  | |   / _ \ / ___|
 | |     / _ \ | | / _ \ | |  | | | | |  _
 | |___ / ___ \| |/ ___ \| |__| |_| | |_| |
  \____/_/   \_|_/_/   \_|_____\___/ \____|


 */
export abstract class AbstractCatalog {
	/**
	 * id for catalog please use id format
	 *
	 *    */
	public id: string;
	/**
	 * Catalog name
	 */
	public abstract readonly name: string;
	/**
	 * Catalog slug
	 */
	public abstract readonly slug: string;

	/**
	 * moving groups to the root only
	 */
	public movingGroupsRootOnly: boolean = false


	/**
	 * Array of all global contexts, which will appear for all elements
	 */
	public readonly actionHandlers: ActionHandler[]

	/**
	 * icon (url or id)
	 */
	public abstract readonly icon: string;

	/**
	 * List of element types
	 */
	public readonly itemTypes: BaseItem<Item>[] = [];


	/**
	 * Method for getting childs elements
	 * if pass null as parentId this root
	 */
	public async getChilds(parentId: string | number | null, byItemType?: string): Promise<Item[]> {
		if (byItemType) {
			const items = await this.getItemType(byItemType)?._getChilds(parentId, this.id);
			return items ? items.sort((a, b) => a.sortOrder - b.sortOrder) : [];
		} else {
			let result: Item[] = [];
			for (const itemType of this.itemTypes) {
				const items = await itemType?._getChilds(parentId, this.id);
				if (items) {
					result = result.concat(items);
				}
			}
			return result.sort((a, b) => a.sortOrder - b.sortOrder);
		}
	}

	private _bindAccessRight() {
		setTimeout(() => {
			const postfix = this.id ? `${this.slug}-${this.id}` : `${this.slug}`
			AccessRightsHelper.registerToken({
				id: `catalog-${postfix}`,
				name: this.name,
				description: `Access to edit catalog for ${postfix}`,
				department: 'catalog'
			});
		}, 100)
	}

	protected constructor(items: BaseItem<any>[]) {
		for (const item of items) {
			this.additemTypes(item)
		}
		this._bindAccessRight()
	}

	public setID(id: string) {
		this.id = id
	}

	/**
	 * Gettind id list method
	 */
	public async getIdList(): Promise<string []> {
		return []
	}

	public getItemType(type: string) {
		return this.itemTypes.find((it) => it.type === type);
	}

	public getGroupType() {
		return this.itemTypes.find((it) => it.isGroup === true);
	}

	public additemTypes<T extends BaseItem<any>>(itemType: T) {
		if (
			itemType.isGroup === true &&
			this.itemTypes.find((it) => it.isGroup === true)
		) {
			throw new Error(`Only one type group is allowed`);
		}
		this.itemTypes.push(itemType);
	}

	/**
	 *  Get an element
	 */
	public find(item: Item) {
		return this.getItemType(item.type)?._find(item.id, this.id);
	}

	/**
	 *  Removing an element
	 */
	public deleteItem(type: string, id: string | number) {
		try {
			this.getItemType(type)?.deleteItem(id, this.id);
		} catch (e) {
			throw e
		}
	}

	/**
	 * Receives HTML to update an element for projection into a popup
	 */
	public getEditHTML(item: Item, id: string | number, loc: string, modelId?: string | number) {
		return this.getItemType(item.type)?.getEditHTML(id, this.id, loc, modelId);
	}

	/**
	 * Receives HTML to create an element for projection into a popup
	 */
	public getAddHTML(item: Item, loc: string) {
		return this.getItemType(item.type)?.getAddHTML(loc);
	}

	public addActionHandler(actionHandler: ActionHandler) {
		if (actionHandler.selectedItemTypes.length > 0) {
			for (let actionItem of actionHandler.selectedItemTypes) {
				this.getItemType(actionItem).addActionHandler(actionHandler)
			}

		} else {
			this.actionHandlers.push(actionHandler);
		}
	}

	/**
	 * Method for getting group elements
	 * If there are several Items, then the global ones will be obtained
	 */
	async getActions(items?: Item[]): Promise<ActionHandler[]> {
		if (items.length === 1) {
			const item = items[0];
			const itemType = this.itemTypes.find((it) => it.type === item.type);

			return itemType.actionHandlers
		} else {
			return this.actionHandlers
		}
	}

	/**
	 * Implements search and execution of a specific action.handler
	 */
	public async handleAction(actionId: string, items?: Item[], config?: any): Promise<void> {
		let action: ActionHandler = null;
		if (items.length === 1) {
			const item = items[0];
			const itemType = this.itemTypes.find((it) => it.type === item.type);
			if (itemType.actionHandlers?.length) {
				action = itemType.actionHandlers.find((it) => it.id === actionId);
			} else {
				action = this.actionHandlers.find((it) => it.id === actionId);
			}
		} else {
			action = this.actionHandlers.find((it) => it.id === actionId);
		}
		// console.log(this.actionHandlers)
		if (!action) throw `Action with id \`${actionId}\` not found`
		return await action.handler(items, config);
	}

	/**
	 * Only For a Link action
	 * @param actionId
	 */
	public async getLink(actionId: string) {
		return this.actionHandlers.find((it) => it.id === actionId)?.getLink();
	}

	/**
	 * For Extermal and JsonForms actions
	 * @param actionId
	 */
	public async getPopUpHTML(actionId: string) {
		return this.actionHandlers.find((it) => it.id === actionId)?.getPopUpHTML();
	}

	/**
	 *
	 * @param data
	 */
	public createItem<T extends Item>(data: T): Promise<T> {
		return this.getItemType(data.type)?.create(data, this.id) as Promise<T>;
	}


	public updateItem<T extends Item>(id: string | number, type: string, data: T): Promise<T> {
		return this.getItemType(type)?.update(id, data, this.id) as Promise<T>;
	}

	/**
	 * To update all items in the tree after updating the model
	 * @param id
	 * @param type
	 * @param data
	 */
	public updateModelItems<T extends Item>(modelId: string | number, type: string, data: T): Promise<T> {
		return this.getItemType(type)?.updateModelItems(modelId, data, this.id) as Promise<T>;
	}

	/**
	 * Method for getting group elements
	 */
	public getitemTypes() {
		return this.itemTypes
	};


	async search<T extends Item>(s: string, hasExtras: boolean = true): Promise<T[]> {
		// Build the trees for all found items
		const accumulator: Item[] = [];

		// Find group type
		const groupType = this.itemTypes.find((item) => item.isGroup === true);

		// Recursive function to build the tree upwards
		const buildTreeUpwards = async (item: Item, hasExtras: boolean): Promise<Item> => {
			// Add extras
			if (hasExtras) {
				const extras = await this.getChilds(item.id);
				accumulator.push(...extras);
			}

			if (item.parentId === null) return item;
			const parentItem = await groupType._find(item.parentId, this.id);
			if (parentItem) {
				accumulator.push(parentItem);
				return buildTreeUpwards(parentItem, hasExtras);
			}
			return item;
		};

		let foundItems: Item[] = [];

		// Handle all search
		for (const itemType of this.itemTypes) {
			const items = (await itemType.search(s, this.id)).map(a => ({...a, marked: true}));
			foundItems = foundItems.concat(items);
		}


		for (const item of foundItems) {
			if (item.parentId !== null) {
				await buildTreeUpwards(item, hasExtras);
			}
		}

		// finalize
		const itemsMap = new Map<string | number, Item>();
		// Add accumulated items to the map
		for (const item of accumulator) {
			itemsMap.set(item.id, item);
		}

		// Overwrite found items
		for (const item of foundItems) {
			itemsMap.set(item.id, item);
		}

		// Convert the map to an array of root items
		const rootItems = Array.from(itemsMap.values());
		return rootItems as T[];
	}


	public static buildTree(items: Item[]): Item[] {
		const tree: Item[] = [];
		const itemMap: { [key: string]: Item } = {};

		items.forEach(item => {
			item.childs = [];
			itemMap[item.id] = item;
		});

		items.forEach(item => {
			if (item.parentId === null) {
				tree.push(item);
			} else {
				const parent = itemMap[item.parentId];
				if (parent) {
					parent.childs.push(item);
				}
			}
		});

		return tree;
	}
}
