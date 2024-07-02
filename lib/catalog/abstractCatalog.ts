import { JSONSchema4 } from "json-schema";


/**
 * Interface `ItemData` describes the data that the UI will operate on
 * This is a common interface for all data that is linked to the catalog
 * This data will also be sent to crud Item
 * */
export interface ItemData {
	id: string | number;
	name: string;
	parentId: string | number | null;
	childs: ItemData[];
	sortOrder: number
	/**
	 * is itemType.id
	 */
	type: string;
	/**
	 * @deprecated level can be find by parnet id
	 */
	level: number;
}


export type _ItemData_ = {
	[key: string]: boolean | string | number | object;
};

export interface NodeModel<TDataType> {
	title: string;
	isLeaf?: boolean;
	children?: NodeModel<TDataType>[];
	/** sortOrder */
	ind?: number
	isExpanded: boolean
	level: number
	data?: TDataType; // any serializable user data
}

/**
 * General Item structure that will be available for all elements, including groups
 */
export abstract class BaseItem {
	public abstract readonly id: string;
	public abstract readonly level: number;
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
	public abstract readonly actionHandlers: ActionHandler[]

	public addActionHandler(contextHandler: ActionHandler) {
		this.actionHandlers.push(contextHandler);
	}

	public abstract find<T extends ItemData>(itemId: string | number): Promise<T & { child: undefined }>;

	/**
	 * Is false because default value Group is added
	 */
	public abstract update<T extends ItemData>(itemId: string | number, data: T): Promise<T & { child: undefined }>;

	public abstract create<T extends ItemData>(itemId: string, data: T): Promise<T & { child: undefined }>;


	/**
	 *  delete element
	 */
	public abstract deleteItem(itemId: string | number): Promise<void>;


	public abstract getAddHTML(): {type: 'link' | 'html', data: string}

	public abstract getEditHTML(id: string | number): Promise<{type: 'link' | 'html', data: string}>;

	/**
	 * @deprecated Will it be merged into getChilds? to use one method 
	 */
	public abstract getCreatedItems(id: string): Promise<{ items: {id: string, title: string}[] }>

	/**
	 *  Set sort value for element
	 */
	public abstract setSortOrder(id: string | number, sortOrder: number): Promise<void>;

	public abstract search(s: string): Promise<ItemData[]>
}

export abstract class GroupType extends BaseItem {

	public readonly isGroup: boolean = true;
	public abstract childs: ItemData[];
}

export abstract class ItemType extends BaseItem {

	public readonly isGroup: boolean = false;

}

/// ContextHandler
export abstract class ActionHandler {

	/**
	 * Three actions are possible, without configuration, configuration via pop-up, and just external action
	 * For the first two, a handler is provided, but the third type of action simply calls the HTML in the popup; the controller will be implemented externally
	 * */
	public readonly type: "basic" |
		// (!*1) "json-forms" | there was an idea to make forms so as not to make controllers every time, but it still seems complicated
		"external" |
		"link"

	/**
	 * Will be shown in the context menu section
	 */
	public readonly displayContext: boolean
	/**
	 * Will be shown in the toolbox section
	 */
	public readonly displayTool: boolean

	// /** (!*1)
	//  * Only for json-forms
	//  * ref: https://jsonforms.io/docs
	//  */
	// Currentrly we not released support JsonForms
	// public abstract readonly uiSchema: any
	// public abstract readonly jsonSchema: JSONSchema4

	/**
	 * For "json-forms" | "external"
	 */
	public abstract getPopUpHTML(): Promise<string>


	/**
	 * Only for link type
	 */
	public abstract getLink(): Promise<string>


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
	public abstract handler(items: ItemData[], config?: any): Promise<void>;

}

/// AbstractCatalog
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
	 * 0 or null without limits
	 */
	public abstract readonly maxNestingDepth: number | null


	/**
	 * Array of all global contexts, which will appear for all elements
	 */
	public abstract readonly actionHandlers: ActionHandler[]

	/**
	 * icon (url or id)
	 */
	public abstract readonly icon: string;

	/**
	 * List of element types
	 */
	public readonly itemsType: (ItemType | GroupType)[] = [];

	/** Add second panel as instance of class */
	public abstract readonly secondPanel: AbstractCatalog | null

	public abstract getCatalog(): Promise<{ nodes: NodeModel<any>[] }>

	protected constructor(items: (GroupType | ItemType)[]) {
		for (const item of items) {
			this.addItemsType(item)
		}
	}

	public setID(id: string){
		this.id = id
	}

	public getItemType(type: string) {
		return this.itemsType.find((it) => it.type === type);
	}


	public addItemsType(itemType: ItemType) {
		if (
			itemType.isGroup === true &&
			this.itemsType.find((it) => it.isGroup === true)
		) {
			throw new Error(`Only one type group is allowed`);
		}
		this.itemsType.push(itemType);
	}

	/**
	 * Method for change sortion order for group and items
	 */
	public async setSortOrder(item: ItemData, sortOrder: number): Promise<void> {
		return await this.getItemType(item.type)?.setSortOrder(item.id, sortOrder);
	}

	/**
	 *  Removing an element
	 */
	public deleteItem(item: ItemData) {
		this.getItemType(item.type)?.deleteItem(item.id);
	}

	/**
	 * Receives HTML to update an element for projection into a popup
	 */
	public getEditHTML(item: ItemData) {
		this.getItemType(item.type)?.getEditHTML(item.id);
	}

	/**
	 * Receives HTML to create an element for projection into a popup
	 */
	public getAddHTML(item: ItemData) {
		return this.getItemType(item.type)?.getAddHTML();
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
	async getActions(items?: ItemData[]): Promise<ActionHandler[]> {
		if (items.length === 1) {
			const item = items[0];
			const itemType = this.itemsType.find((it) => it.id === item.type);
			return itemType.actionHandlers
		} else {
			return this.actionHandlers
		}
	}

	/**
	 * Implements search and execution of a specific action.handler
	 */
	public async handleAction(actionId: string, items?: ItemData[], config?: any): Promise<void> {
		let action: ActionHandler = null;
		if (items.length === 1) {
			const item = items[0];
			const itemType = this.itemsType.find((it) => it.id === item.type);
			action = itemType.actionHandlers.find((it) => it.id === actionId);
		} else {
			action = this.actionHandlers.find((it) => it.id === actionId);
		}

		if(!action) throw `Action with id \`${actionId}\` not found`
		return await action.handler(items, config);
	}

	public createItem<T extends ItemData>(data: T): Promise<T> {
		return this.getItemType(data.type)?.create(this.id, data);
	}


	public updateItem<T extends ItemData>(id: string, data: T): Promise<T> {
		return this.getItemType(data.type)?.update(id, data);
	}

	/**
	 * Method for getting group elements
	 */
	public getItemsType(): (ItemType | GroupType)[] {
		return this.itemsType
	};

	/**
	 * @deprecated use `getItemsType()`
		 * Method for getting group elements
		 */
	public getItems(): (ItemType | GroupType)[] {
		return this.itemsType
	};

	/**
	 * Method for getting group childs elements
	 * if pass null as parentId this root
	 */
	public abstract getChilds(data:any): Promise<{ nodes: NodeModel<any>[] }>

	public getCreatedItems(itemTypeId: string) {
		return this.getItemType(itemTypeId)?.getCreatedItems(this.id)
	}



	async search(s: string): Promise<ItemData[]> {
		let foundItems: ItemData[] = [];

		// Handle all search
		for (const itemType of this.itemsType) {
			const items = await itemType.search(s);
			foundItems = foundItems.concat(items);
		}

		// Find group type
		const groupType = this.itemsType.find((item) => item.isGroup === true);

		// Recursive function to build the tree upwards
		const buildTreeUpwards = async (item: ItemData, accumulator: ItemData[]): Promise<ItemData> => {
			if (item.parentId === null) return item;

			const parentItem = await groupType.find(item.parentId);
			if (parentItem) {
				accumulator.push(parentItem);
				return buildTreeUpwards(parentItem, accumulator);
			}
			return item;
		};

		// Build the trees for all found items
		const itemsMap = new Map<string | number, ItemData>();
		const accumulator: ItemData[] = [];

		for (const item of foundItems) {
			itemsMap.set(item.id, item);
			if (item.parentId !== null) {
				await buildTreeUpwards(item, accumulator);
			}
		}

		// Add accumulated items to the map
		for (const item of accumulator) {
			itemsMap.set(item.id, item);
		}

		// Convert the map to an array of root items
		const rootItems = Array.from(itemsMap.values()).filter(item => item.parentId === null);
		return rootItems;
	}
}
