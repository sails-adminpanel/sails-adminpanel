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
    getItems() {
        return this.catalog.getItems();
    }
    getCatalog() {
        return this.catalog.getCatalog();
    }
    createItem(item, data) {
        return this.catalog.createItem(item, data);
    }
    getChilds(data) {
        return this.catalog.getChilds(data);
    }
    getCreatedItems(item) {
        return this.catalog.getCreatedItems(item);
    }
    getActions(items) {
        return this.catalog.getActions(items);
    }
    search(s) {
        return this.catalog.search(s);
    }
    setSortOrder(data) {
        return this.catalog.setSortOrder(data);
    }
    handleAction(actionID, items, config) {
        return this.catalog.handleAction(actionID, items, config);
    }
    updateItem(item, id, data) {
        return this.catalog.updateItem(item, id, data);
    }
}
exports.VueCatalog = VueCatalog;
class VueCatalogUtils {
    /**
     * Удаляет лишнее из данных с фронта
     */
    static refinement() {
    }
    static toNode(data) {
        const node = {
            children: [], // newNode.childs,
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
        };
        return node;
    }
}
exports.VueCatalogUtils = VueCatalogUtils;
