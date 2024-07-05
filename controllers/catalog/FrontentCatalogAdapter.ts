import { AbstractCatalog, Item } from "../../lib/catalog/AbstractCatalog";


interface NodeModel<TDataType> {
  title: string;
  isLeaf: boolean;
  isExpanded: boolean;
  ind: number;
  data?: TDataType;
  children?: NodeModel<TDataType>[];

  isSelected?: boolean;
  isVisible?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  path?: number[];
  pathStr?: string;
  level?: number;
  isFirstChild?: boolean;
  isLastChild?: boolean;
}

interface NodeData extends Item { }

interface RequestData {
  reqNode: NodeModel<NodeData>[];
  reqParent: NodeModel<NodeData>;
  _method: string;
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
    return VueCatalogUtils.arrayToNode(rootItems);
  }

  createItem(data: any) {
    data = VueCatalogUtils.refinement(data);
    return this.catalog.createItem(data);
  }

  getChilds(data: any) {
    data = VueCatalogUtils.refinement(data);
    return this.catalog.getChilds(data.id);
  }

  // Moved into actions
  // getCreatedItems(data: any) {
  //   data = VueCatalogUtils.refinement(data);
  //   return this.catalog.getChilds(data.id);
  // }

  search(s: string) {
    return this.catalog.search(s);
  }

  async updateTree(data: RequestData): Promise<any> {
    let reqNodes = data.reqNode;

    if (!Array.isArray(data.reqNode)) {
      reqNodes = [data.reqNode];
    }

    const reqParent = data.reqParent;
    if (!reqParent.data.parentId) {
      throw `reqParent.data.parentId not defined`
    }

    // It’s unclear why he’s coming reqNodes
    for (const reqNode of reqNodes) {
      const item = await this.catalog.find(reqNode.data);
      if (!item) {
        throw `reqNode Item not found`
      }
    }

    // Update all items into parent (for two reason: update parent, updare sorting order)
    let sortCount = 0;
    for (const childNode of reqParent.children) {
      childNode.data.sortOrder = sortCount;
      childNode.data.parentId = reqParent.data.parentId
      await this.catalog.updateItem(childNode.data.id, childNode.data.type, childNode.data);
      sortCount++;
    }

    // Retrun tree
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
      data: data,
      isLeaf: false,
      isExpanded: false,
      ind: data.sortOrder,
      title: data.name
    }
    return node;
  }
} 