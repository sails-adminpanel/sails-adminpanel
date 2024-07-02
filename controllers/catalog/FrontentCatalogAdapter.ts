import { Item } from "../../lib/catalog/abstractCatalog";

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

class VueCatalogHelper {
  /**
   * Удаляет лишнее из данных с фронта
   */
  public refinement<T>() {

  }
  public toNode<T extends Item>(data: T): NodeModel<T> {
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