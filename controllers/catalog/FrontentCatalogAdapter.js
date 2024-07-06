"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueCatalogUtils = exports.VueCatalog = void 0;
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
        data = VueCatalogUtils.refinement(data);
        return this.catalog.createItem(data);
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
    search(s) {
        return this.catalog.search(s);
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
        const result = [];
        for (const node of items) {
            result.push(this.toNode(node, groupTypeName));
        }
        return result;
    }
    static toNode(data, groupTypeName) {
        const node = {
            data: data,
            isLeaf: data.type !== groupTypeName,
            isExpanded: false,
            ind: data.sortOrder,
            title: data.name
        };
        return node;
    }
    static expandTo(vueCatalogData, theseItemIdNeedToBeOpened) {
        function expand(node) {
            if (theseItemIdNeedToBeOpened.includes(node.data.id)) {
                node.isExpanded = true;
            }
            if (node.children) {
                for (const child of node.children) {
                    expand(child);
                }
            }
        }
        expand(vueCatalogData);
        return vueCatalogData;
    }
}
exports.VueCatalogUtils = VueCatalogUtils;
