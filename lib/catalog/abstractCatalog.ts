/**
 * Interface `Item` describes the data that the UI will operate on
 */
export interface Item {
	id: string | number;
	type: string;
	name: string;
	parentId: string | number | null;
	childs: Item[];
}


/**
 * General Item structure that will be available for all elements, including groups
 */
export abstract class BaseItem implements Item {
	public abstract readonly id: string;
	/**
	 * Catalog name
	 */
	public abstract readonly name: string;
	/**
	 * A sign that this is a group
	 */
	public abstract readonly isGroup: boolean;

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

	/**
	 * Is false because default value Group is added
	 */
	public abstract update(id: string | number, item: Item): Promise<void>;

	public abstract create(data: any): Promise<any>;

	/**
	 *  Set sort value for element
	 */
	public abstract setSortOrder(id: string | number, sortOrder: number);

	/**
	 *  delete element
	 */
	public abstract deleteItem(id: string | number);

	public abstract childs: Item[];
	public abstract parentId: string | number | null;
	public abstract type: string;
}

export abstract class GroupType extends BaseItem {

	public readonly isGroup: boolean = true;

	public abstract getAddHTML(): string

	public abstract getEditHTML(id: string | number): string;
}

export abstract class ItemType extends BaseItem {

	public abstract getAddHTML(): string

	public readonly isGroup: boolean = false;

	public abstract getEditHTML(id: string | number): string;
}

/// ContextHandler
export abstract class ActionHandler {
	/**
	 * Three actions are possible, without configuration, configuration via pop-up, and just external action
	 * For the first two, a handler is provided, but the third type of action simply calls the HTML in the popup; the controller will be implemented externally
	 * */
	public readonly type: "basic" | "configured" | "external"

	/**
	 * Display option
	 */
	public readonly display: "context" | "tool"

	/**
	 * For which elements the action can be used
	 */
	public readonly selectedItemTypes: string[]

	/**
	 * icon (url or id)
	 */
	public abstract readonly icon: string;

	/**
	 * Implementation of a method that will do something with elements.
	 * there's really not much you can do with the context menu
	 * @param items
	 */
	public abstract handler(items?: Item[]): string;

}

/// AbstractCatalog
export abstract class AbstractCatalog {
	/**
	 * id for catalog please use id format
	 *
	 *    */
	public abstract readonly id: string;
	/**
	 * Catalog name
	 */
	public abstract readonly name: string;
	/**
	 * Catalog slug
	 */
	public abstract readonly slug: string;

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
	public readonly itemsType: ItemType[] | GroupType[] = [];

	/** Add second panel as instance of class */
	public abstract readonly secondPanel: AbstractCatalog | null

	// constructor(parameters) {
	// }

	public getItemType(type: string) {
		return this.itemsType.find((it) => it.type === type);
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


	public addItemsType(itemType: ItemType) {
		// Возможно что страницы будут иметь ссылки внутри
		// if (
		//   itemType.isGroup === true &&
		//   this.itemsType.find((it) => it.isGroup === true)
		// ) {
		//   throw new Error(`Only one type group is allowed`);
		// }
		this.itemsType.push(itemType);
	}

	/**
	 * Method for change sortion order for group and items
	 */
	public setSortOrder(item: Item, sortOrder: number) {
		this.getItemType(item.type)?.setSortOrder(item.id, sortOrder);
	}

	/**
	 *  Removing an element
	 */
	public deleteItem(item: Item) {
		this.getItemType(item.type)?.deleteItem(item.id);
	}

	/**
	 * Receives HTML to update an element for projection into a popup
	 */
	public getEditHTML(item: Item) {
		this.getItemType(item.type)?.getEditHTML(item.id);
	}

	/**
	 * Receives HTML to create an element for projection into a popup
	 */
	public getAddHTML(item: Item): string {
		return this.getItemType(item.type)?.getAddHTML();
	}

	/**
	 * Method for getting group elements
	 * If there are several Items, then the global ones will be obtained
	 */
	public getContextAction(items?: Item[]): ActionHandler[] {
		if (items.length === 1) {
			const item = items[0];
			const itemType = this.itemsType.find((it) => it.id === item.id);
			return itemType.actionHandlers
		} else {
			return this.actionHandlers.filter((ah) => ah.display === "context")
		}
	}

	public create(item: Item, data: any) {
		return this.getItemType(item.type)?.create(data);
	}

	/**
	 * Method for getting group elements
	 */
	public getItems(): ItemType[] | GroupType[] {
		return this.itemsType
	};

}
