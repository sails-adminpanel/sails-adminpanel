"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueCatalogUtils = exports.VueCatalog = void 0;
const AbstractCatalog_1 = require("../../lib/catalog/AbstractCatalog");
class VueCatalog {
    constructor(_catalog) {
        this.catalog = _catalog;
    }
    setID(id) {
        this.catalog.setID(id);
    }
    getItemType(type) {
        return this.catalog.getItemType(type);
    }
    getAddHTML(item) {
        return this.catalog.getAddHTML(item);
    }
    getitemTypes() {
        return this.catalog.getitemTypes();
    }
    getActions(items) {
        return this.catalog.getActions(items);
    }
    handleAction(actionID, items, config) {
        return this.catalog.handleAction(actionID, items, config);
    }
    //Below are the methods that require action
    async getCatalog() {
        let rootItems = await this.catalog.getChilds(null);
        return VueCatalogUtils.arrayToNode(rootItems, this.catalog.getGroupType().type);
    }
    createItem(data) {
        console.log(data);
        data = VueCatalogUtils.refinement(data);
        //return this.catalog.createItem(data);
    }
    async getChilds(data) {
        data = VueCatalogUtils.refinement(data);
        return VueCatalogUtils.arrayToNode(await this.catalog.getChilds(data.id), this.catalog.getGroupType().type);
    }
    // Moved into actions
    // getCreatedItems(data: any) {
    //   data = VueCatalogUtils.refinement(data);
    //   return this.catalog.getChilds(data.id);
    // }
    async search(s) {
        let searchResult = await this.catalog.search(s);
        let itemsTree = AbstractCatalog_1.AbstractCatalog.buildTree(searchResult);
        return VueCatalogUtils.treeToNode(itemsTree, this.catalog.getGroupType().type);
    }
    async updateTree(data) {
        let reqNodes = data.reqNode;
        if (!Array.isArray(data.reqNode)) {
            reqNodes = [data.reqNode];
        }
        let reqParent = data.reqParent;
        if (reqParent.data.id === 0) {
            reqParent.data.id = null;
        }
        if (reqParent.data.id === undefined) {
            throw `reqParent.data.id not defined`;
        }
        // It’s unclear why he’s coming reqNodes
        for (const reqNode of reqNodes) {
            const item = await this.catalog.find(reqNode.data);
            if (!item) {
                throw `reqNode Item not found`;
            }
        }
        // Update all items into parent (for two reason: update parent, updare sorting order)
        let sortCount = 0;
        for (const childNode of reqParent.children) {
            childNode.data.sortOrder = sortCount;
            childNode.data.parentId = reqParent.data.id;
            await this.catalog.updateItem(childNode.data.id, childNode.data.type, childNode.data);
            sortCount++;
        }
        // Retrun tree
    }
    updateItem(item, id, data) {
        return this.catalog.updateItem(item, id, data);
    }
}
exports.VueCatalog = VueCatalog;
class VueCatalogUtils {
    /**
     * Removes unnecessary data from the front
     */
    static refinement(nodeModel) {
        return nodeModel.data;
    }
    static arrayToNode(items, groupTypeName) {
        return items.map(node => VueCatalogUtils.toNode(node, groupTypeName));
    }
    static toNode(data, groupTypeName) {
        return {
            data: data,
            isLeaf: data.type !== groupTypeName,
            isExpanded: false,
            ind: data.sortOrder,
            title: data.name
        };
    }
    static expandTo(vueCatalogData, theseItemIdsNeedToBeOpened) {
        function expand(node) {
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
    static treeToNode(tree, groupTypeName) {
        function buildNodes(items) {
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
exports.VueCatalogUtils = VueCatalogUtils;
