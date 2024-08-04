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
    getAddHTML(item, loc) {
        return this.catalog.getAddHTML(item, loc);
    }
    getEditHTML(item, id, loc, modelId) {
        return this.catalog.getEditHTML(item, id, loc, modelId);
    }
    getitemTypes() {
        return this.catalog.getitemTypes();
    }
    getLocales(loc) {
        let messages = this.catalog.getLocalizeMessages();
        const i18nFactory = require('i18n-2');
        let i18n = new i18nFactory({
            ...sails.config.i18n,
            directory: sails.config.i18n.localesDirectory,
            extension: ".json"
        });
        i18n.setLocale(loc);
        let outMessages = {};
        for (const mess of Object.keys(messages)) {
            outMessages[mess] = i18n.__(mess);
        }
        return outMessages;
    }
    async getActions(items, type) {
        let arrItems = [];
        for (const item of items) {
            arrItems.push(await this.catalog.find(item.data));
        }
        if (type === 'tools') {
            return (await this.catalog.getActions(arrItems))?.filter(e => e.displayTool);
        }
        else {
            return (await this.catalog.getActions(arrItems))?.filter(e => e.displayContext);
        }
    }
    async handleAction(actionId, items, config) {
        let arrItems = [];
        for (const item of items) {
            arrItems.push(await this.catalog.find(item.data));
        }
        return this.catalog.handleAction(actionId, arrItems, config);
    }
    async getPopUpHTML(actionId) {
        return this.catalog.getPopUpHTML(actionId);
    }
    async getLink(actionId) {
        return this.catalog.getLink(actionId);
    }
    //Below are the methods that require action
    async getCatalog() {
        let rootItems = await this.catalog.getChilds(null);
        return VueCatalogUtils.arrayToNode(rootItems, this.catalog.getGroupType().type);
    }
    createItem(data) {
        //data = VueCatalogUtils.refinement(data);
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
            // console.log(">>>>>>>>>", "this.catalog.find", reqNode)
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
        return Promise.resolve('ok');
    }
    async updateItem(item, modelId, data) {
        return await this.catalog.updateModelItems(modelId, item.type, data);
    }
    async deleteItem(items) {
        for (const item1 of items) {
            if (item1.children?.length) {
                await this.deleteItem(item1.children);
            }
            this.catalog.deleteItem(item1.data.type, item1.data.id);
        }
        return { ok: true };
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
