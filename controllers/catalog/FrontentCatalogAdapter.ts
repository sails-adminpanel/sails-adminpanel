import { AbstractCatalog, Item } from "../../lib/catalog/AbstractCatalog";


export interface NodeData extends Item {
	level: number;
}

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

  getCatalog() {
    return this.catalog.getCatalog();
  }

  createItem(item: any, data: any) {
    return this.catalog.createItem(item, data);
  }

  getChilds(data: any) {
    return this.catalog.getChilds(data);
  }

  getCreatedItems(item: any) {
    return this.catalog.getCreatedItems(item);
  }

  getActions(items: any[]) {
    return this.catalog.getActions(items);
  }

  search(s: string) {
    return this.catalog.search(s);
  }

  setSortOrder(data: any) {
    return this.catalog.setSortOrder(data);
  }

  handleAction(actionID: string, items: any[], config: any) {
    return this.catalog.handleAction(actionID, items, config);
  }

  updateItem(item: any, id: string, data: any) {
    return this.catalog.updateItem(item, id, data);
  }
}

export class VueCatalogUtils {
  /**
   * Удаляет лишнее из данных с фронта
   */
  public static refinement<T>() {

  }
  public static toNode<T extends NodeData>(data: T): NodeModel<T> {
    const node: NodeModel<T> = {
      children: [],// newNode.childs,
      data: data
      // {
      //   ...newNode.groups.data,
      //   id: newNode.groups.id,
      //   type: newNode.type,
      //   parent: newNode.parentID
      // }
      ,
      isLeaf: false,
      isExpanded: false,
      ind: data.sortOrder,
      title: data.name,
      level: data.level
    }
    return node;
  }
} 