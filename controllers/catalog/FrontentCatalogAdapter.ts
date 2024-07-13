import {AbstractCatalog, Item} from "../../lib/catalog/AbstractCatalog";


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

interface NodeData extends Item {
}

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

	getEditHTML(item: any, id: string | number) {
		return this.catalog.getEditHTML(item, id)
	}

	getitemTypes() {
		return this.catalog.getitemTypes();
	}

	async getActions(items: NodeModel<any>[], type: string) {
		let arrItems = []
		for (const item of items) {
			arrItems.push(await this.catalog.find(item.data))
		}
		if(type === 'tools'){
			return (await this.catalog.getActions(arrItems))?.filter(e => e.displayTool);
		} else {
			return (await this.catalog.getActions(arrItems))?.filter(e => e.displayContext);
		}
	}

	async handleAction(actionID: string, items: any[], config: any) {
		let arrItems = []
		for (const item of items) {
			arrItems.push(await this.catalog.find(item.data))
		}
		return this.catalog.handleAction(actionID, arrItems, config);
	}

	//Below are the methods that require action

	async getCatalog() {
		let rootItems = await this.catalog.getChilds(null);
		return VueCatalogUtils.arrayToNode(rootItems, this.catalog.getGroupType().type);
	}

	createItem(data: any) {
		//data = VueCatalogUtils.refinement(data);
		return this.catalog.createItem(data);
	}

	async getChilds(data: any) {
		data = VueCatalogUtils.refinement(data);
		return VueCatalogUtils.arrayToNode(await this.catalog.getChilds(data.id), this.catalog.getGroupType().type);
	}

	// Moved into actions
	// getCreatedItems(data: any) {
	//   data = VueCatalogUtils.refinement(data);
	//   return this.catalog.getChilds(data.id);
	// }

	async search(s: string) {
		let searchResult = await this.catalog.search(s);
		let itemsTree = AbstractCatalog.buildTree(searchResult);
		return VueCatalogUtils.treeToNode(itemsTree, this.catalog.getGroupType().type);
	}

	async updateTree(data: RequestData): Promise<any> {
		let reqNodes = data.reqNode;
		console.log(reqNodes);
		if (!Array.isArray(data.reqNode)) {
			reqNodes = [data.reqNode];
		}

		let reqParent = data.reqParent;

		if (reqParent.data.id === 0) {
			reqParent.data.id = null;
		}

		if (reqParent.data.id === undefined) {
			throw `reqParent.data.id not defined`
		}

		// It’s unclear why he’s coming reqNodes
		for (const reqNode of reqNodes) {
			console.log(">>>>>>>>>", "this.catalog.find", reqNode)
			const item = await this.catalog.find(reqNode.data);
			if (!item) {
				throw `reqNode Item not found`
			}
		}

		// Update all items into parent (for two reason: update parent, updare sorting order)
		let sortCount = 0;
		for (const childNode of reqParent.children) {
			childNode.data.sortOrder = sortCount;
			childNode.data.parentId = reqParent.data.id
			await this.catalog.updateItem(childNode.data.id, childNode.data.type, childNode.data);
			sortCount++;
		}

		// Retrun tree
	}


	updateItem(item: any, id: string, data: any) {
		return this.catalog.updateItem(id, item.type, data);
	}

	async deleteItem(items: NodeModel<any>[]) {
		for (const item1 of items) {
			if(item1.children?.length){
				await this.deleteItem(item1.children)
			}
			this.catalog.deleteItem(item1.data.type, item1.data.id)
		}
		return {ok: true}
	}
}

export class VueCatalogUtils {
	/**
	 * Removes unnecessary data from the front
	 */
	public static refinement<T extends NodeModel<any>>(nodeModel: T) {
		return nodeModel.data;
	}

	public static arrayToNode<T extends Item>(items: T[], groupTypeName: string): NodeModel<T>[] {
		return items.map(node => VueCatalogUtils.toNode(node, groupTypeName));
	}

	public static toNode<T extends NodeData>(data: T, groupTypeName: string): NodeModel<T> {
		return {
			data: data,
			isLeaf: data.type !== groupTypeName,
			isExpanded: false,
			ind: data.sortOrder,
			title: data.name
		};
	}

	public static expandTo<T extends NodeData>(vueCatalogData: NodeModel<T>, theseItemIdsNeedToBeOpened: (string | number)[]): NodeModel<T> {
		function expand(node: NodeModel<T>): void {
			if (theseItemIdsNeedToBeOpened.includes(node.data.id)) {
				node.isExpanded = true;
			}

			if (node.children) {
				for (const child of node.children) {
					expand(child);
				}
			}
		}

		theseItemIdsNeedToBeOpened.forEach(id => {
			expand(vueCatalogData);
		});

		return vueCatalogData;
	}

	public static treeToNode(tree: Item[], groupTypeName: string): NodeModel<Item>[] {
		function buildNodes(items: Item[]): NodeModel<Item>[] {
			return items.map(item => {
				const node = VueCatalogUtils.toNode(item, groupTypeName);
				if (item.childs && item.childs.length > 0) {
					// Sort the children before building their nodes
					item.childs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
					node.children = buildNodes(item.childs);
					node.isExpanded = !node.isLeaf;
				}
				return node;
			});
		}

		return buildNodes(tree);
	}
}

