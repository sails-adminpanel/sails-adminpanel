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
        VueCatalogUtils.arrayToNode(rootItems);
    }
    createItem(data) {
        data = VueCatalogUtils.refinement(data);
        return this.catalog.createItem(data);
    }
    getChilds(data) {
        data = VueCatalogUtils.refinement(data);
        return this.catalog.getChilds(data.id);
    }
    getCreatedItems(data) {
        data = VueCatalogUtils.refinement(data);
        return this.catalog.getChilds(data.id);
    }
    search(s) {
        return this.catalog.search(s);
    }
    setSortOrder(data) {
        return this.catalog.setSortOrder(data);
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
    static arrayToNode(items) {
        const result = [];
        for (const node of items) {
            result.push(this.toNode(node));
        }
        return result;
    }
    static toNode(data) {
        const node = {
            children: [], // newNode.childs,
            data: data,
            isLeaf: false,
            isExpanded: false,
            ind: data.sortOrder,
            title: data.name
        };
        return node;
    }
}
exports.VueCatalogUtils = VueCatalogUtils;
