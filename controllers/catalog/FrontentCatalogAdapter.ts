import { AbstractCatalog, Item } from "../../lib/catalog/AbstractCatalog";


export interface NodeData extends Item { }

export interface NodeModel<TDataType> {
  title: string;
  isLeaf?: boolean;
  children?: NodeModel<TDataType>[];
  /** sortOrder */
  ind?: number;
  isExpanded: boolean;
  data?: TDataType;
}

export class VueCatalog {
  catalog: AbstractCatalog;

  constructor(_catalog: AbstractCatalog) {
    this.catalog = _catalog;
  }

  setID(id: string) {
    this.catalog.setID(id);
  }

  getItemType(type: string) {
    return this.catalog.getItemType(type);
  }

  getAddHTML(item: any) {
    return this.catalog.getAddHTML(item);
  }

  getitemTypes() {
    return this.catalog.getitemTypes();
  }

  getActions(items: any[]) {
    return this.catalog.getActions(items);
  }

  handleAction(actionID: string, items: any[], config: any) {
    return this.catalog.handleAction(actionID, items, config);
  }

  //Below are the methods that require action

  async getCatalog() {
    let rootItems = await this.catalog.getChilds(null);
    VueCatalogUtils.arrayToNode(rootItems);
  }

  createItem(data: any) {
    data = VueCatalogUtils.refinement(data);
    return this.catalog.createItem(data);
  }

  getChilds(data: any) {
    data = VueCatalogUtils.refinement(data);
    return this.catalog.getChilds(data.id);
  }

  getCreatedItems(data: any) {
    data = VueCatalogUtils.refinement(data);
    return this.catalog.getChilds(data.id);
  }

  search(s: string) {
    return this.catalog.search(s);
  }

  async setSortOrder(data: { reqNode: NodeModel<any>, reqParent: any }): Promise<any> {
    try {
      await this.setChildsDB(data.reqParent);
      if (data.reqNode.children.length > 0) {
        for (const child of data.reqNode.children) {
          await this.setLevel(child);
        }
      }
      if (data.reqNode.data.parent) {
        let newNode;
        if (data.reqNode.data.type === 'group_2' || data.reqNode.data.type === 'group_1') {
          newNode = (await CatalogGroupNav.find({ label: this.id, groups: data.reqNode.data.id }))[0];
        }
        if (data.reqNode.data.type === 'page') {
          newNode = (await CatalogPageNav.find({ label: this.id, pages: data.reqNode.data.id }))[0];
        }
        if (newNode.parentID !== data.reqNode.data.parent) {
          await this.removeChildsDB(data.reqNode);
        }
      }

      // Here we call the second setSortOrder method
      const item: Item = {
        id: data.reqNode.data.id,
        type: data.reqNode.data.type,
        // other properties of item if necessary
      };
      const sortOrder: number = data.reqNode.data.sortOrder; // Assuming sortOrder is a property of reqNode.data

      await this.catalog.setSortOrder(item, sortOrder);

      return Promise.resolve({ ok: true });
    } catch (e) {
      return e;
    }
  }


  updateItem(item: any, id: string, data: any) {
    return this.catalog.updateItem(item, id, data);
  }
}

export class VueCatalogUtils {
  /**
   * Removes unnecessary data from the front
   */
  public static refinement<T extends NodeModel<any>>(nodeModel: T) {
    return nodeModel.data;
  }

  public static arrayToNode<T extends Item>(items: T[]): NodeModel<T>[] {
    const result = [];
    for (const node of items) {
      result.push(this.toNode(node))
    }
    return result;
  }

  public static toNode<T extends NodeData>(data: T): NodeModel<T> {
    const node: NodeModel<T> = {
      children: [], // newNode.childs,
      data: data,
      isLeaf: false,
      isExpanded: false,
      ind: data.sortOrder,
      title: data.name
    }
    return node;
  }
} 