import { AbstractCatalog, ActionHandler, AbstractGroup, AbstractItem, Item } from "../../lib/catalog/AbstractCatalog";

interface GroupTestItem extends Item {
  thisIsGroup: boolean
}

export class VirtualTree {

  public static async addElementIntoGroup(parentId: string | number): Promise<void> {

  }

  public static async removeElementById(id: string | number): Promise<void> {

  }

  public static async findElementById(id: string | number): Promise<GroupTestItem> {
    let item = {
      id: "",
      name: "",
      parentId: "",
      sortOrder: 0,
      icon: "",
      type: "",
      thisIsGroup: true
    }
    return item;
  }
}

/**
 * 
 _____         _    ____                       
|_   _|__  ___| |_ / ___|_ __ ___  _   _ _ __  
  | |/ _ \/ __| __| |  _| '__/ _ \| | | | '_ \ 
  | |  __/\__ \ |_| |_| | | | (_) | |_| | |_) |
  |_|\___||___/\__|\____|_|  \___/ \__,_| .__/ 
                                        |_|    
 */

export class TestGroup extends AbstractGroup<GroupTestItem> {
  public childs: Item[];
  public level: number;
  public name: string;
  public allowedRoot: boolean;
  public icon: string;
  public actionHandlers: ActionHandler[];


  public async find(itemId: string | number) {
    return await VirtualTree.findElementById(itemId);
  }

  public update(itemId: string | number, data: GroupTestItem): Promise<GroupTestItem> {
    throw new Error("Method not implemented.");
  };


  public create(itemId: string, data: GroupTestItem): Promise<GroupTestItem> {
    throw new Error("Method not implemented.");
  }

  public deleteItem(itemId: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public getAddHTML(): { type: "link" | "html"; data: string; } {
    throw new Error("Method not implemented.");
  }
  public getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
    throw new Error("Method not implemented.");
  }
  public getChilds(parentId: string | number): Promise<Item[]> {
    throw new Error("Method not implemented.");
  }
  public setSortOrder(id: string | number, sortOrder: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public search(s: string): Promise<GroupTestItem[]> {
    throw new Error("Method not implemented.");
  }
}

/**
 ___ _                 _ 
|_ _| |_ ___ _ __ ___ / |
 | || __/ _ \ '_ ` _ \| |
 | || ||  __/ | | | | | |
|___|\__\___|_| |_| |_|_|
 */

export class Item1 extends AbstractItem<Item> {
  public childs: Item[];
  public type: string;
  public level: number;
  public name: string;
  public allowedRoot: boolean;
  public icon: string;
  public actionHandlers: ActionHandler[];


  public async find(itemId: string | number) {
    return await VirtualTree.findElementById(itemId);
  }

  public update(itemId: string | number, data: GroupTestItem): Promise<GroupTestItem> {
    throw new Error("Method not implemented.");
  };


  public create(itemId: string, data: GroupTestItem): Promise<GroupTestItem> {
    throw new Error("Method not implemented.");
  }

  public deleteItem(itemId: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public getAddHTML(): { type: "link" | "html"; data: string; } {
    throw new Error("Method not implemented.");
  }
  public getEditHTML(id: string | number): Promise<{ type: "link" | "html"; data: string; }> {
    throw new Error("Method not implemented.");
  }
  public getChilds(parentId: string | number): Promise<Item[]> {
    throw new Error("Method not implemented.");
  }
  public setSortOrder(id: string | number, sortOrder: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public search(s: string): Promise<GroupTestItem[]> {
    throw new Error("Method not implemented.");
  }
}




export class TestCatalog extends AbstractCatalog {
  public name: string = "test catalog";
  public slug: string = "test";
  public maxNestingDepth: number = null;
  public icon: string = "box";

  constructor() {
    super([
      new TestGroup(),
      new Item1()
    ]);
  }
}