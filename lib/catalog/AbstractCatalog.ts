import { ActionHandler, ItemType, GroupType, NodeModel, ItemPacket } from "./abstractCatalog";

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
  public abstract readonly maxNestingDepth: number | null;


  /**
   * Array of all global contexts, which will appear for all elements
   */
  public abstract readonly actionHandlers: ActionHandler[];

  /**
   * icon (url or id)
   */
  public abstract readonly icon: string;

  /**
   * List of element types
   */
  public readonly itemsType: (ItemType | GroupType)[] = [];

  /** Add second panel as instance of class */
  public abstract readonly secondPanel: AbstractCatalog | null;

  public abstract getCatalog(): Promise<{ nodes: NodeModel<any>[]; }>;

  protected constructor(items: (GroupType | ItemType)[]) {
    for (const item of items) {
      this.addItemsType(item);
    }
  }

  public setID(id: string) {
    this.id = id;
  }

  public getItemType(type: string) {
    return this.itemsType.find((it) => it.type === type);
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
  public async setSortOrder(item: ItemPacket, sortOrder: number): Promise<void> {
    return await this.getItemType(item.type)?.setSortOrder(item.id, sortOrder);
  }

  /**
   *  Removing an element
   */
  public deleteItem(item: ItemPacket) {
    this.getItemType(item.type)?.deleteItem(item.id);
  }

  /**
   * Receives HTML to update an element for projection into a popup
   */
  public getEditHTML(item: ItemPacket) {
    this.getItemType(item.type)?.getEditHTML(item.id);
  }

  /**
   * Receives HTML to create an element for projection into a popup
   */
  public getAddHTML(item: ItemPacket) {
    return this.getItemType(item.type)?.getAddHTML();
  }

  public addActionHandler(actionHandler: ActionHandler) {
    if (actionHandler.selectedItemTypes.length > 0) {
      for (let actionItem of actionHandler.selectedItemTypes) {
        this.getItemType(actionItem).addActionHandler(actionHandler);
      }

    } else {
      this.actionHandlers.push(actionHandler);
    }
  }

  /**
   * Method for getting group elements
   * If there are several Items, then the global ones will be obtained
   */
  async getActions(items?: ItemPacket[]): Promise<ActionHandler[]> {
    if (items.length === 1) {
      const item = items[0];
      const itemType = this.itemsType.find((it) => it.id === item.type);
      return itemType.actionHandlers;
    } else {
      return this.actionHandlers;
    }
  }

  /**
   * Implements search and execution of a specific action.handler
   */
  public async handleAction(actionId: string, items?: ItemPacket[], config?: any): Promise<void> {
    let action: ActionHandler = null;
    if (items.length === 1) {
      const item = items[0];
      const itemType = this.itemsType.find((it) => it.id === item.type);
      action = itemType.actionHandlers.find((it) => it.id === actionId);
    } else {
      action = this.actionHandlers.find((it) => it.id === actionId);
    }

    if (!action) throw `Action with id \`${actionId}\` not found`;
    return await action.handler(items, config);
  }

  public createItem<T extends ItemPacket>(data: T): Promise<T> {
    return this.getItemType(data.type)?.create(this.id, data);
  }


  public updateItem<T extends ItemPacket>(id: string, data: T) {
    return this.getItemType(data.type)?.update(id, data);
  }

  /**
   * Method for getting group elements
   */
  public getItemsType(): (ItemType | GroupType)[] {
    return this.itemsType;
  };

  /**
   * @deprecated use `getItemsType()`
       * Method for getting group elements
       */
  public getItems(): (ItemType | GroupType)[] {
    return this.itemsType;
  };

  /**
   * Method for getting group childs elements
   * if pass null as parentId this root
   */
  public abstract getChilds(data: any): Promise<{ nodes: NodeModel<any>[]; }>;

  public getCreatedItems(itemTypeId: string) {
    return this.getItemType(itemTypeId)?.getCreatedItems(this.id);
  }

  public async search(s: string): Promise<ItemPacket[]> {
    let foundItems: ItemPacket[] = [];

    // Find all group types
    const groupTypes = this.itemsType.find((item) => item.isGroup === true);

    // handle all search
    for (const itemType of this.itemsType) {
      foundItems = foundItems.concat(await itemType.search(s));
    }

    return foundItems;
  }
}
