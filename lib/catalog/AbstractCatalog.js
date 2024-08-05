"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = exports.ActionHandler = exports.AbstractItem = exports.AbstractGroup = exports.BaseItem = void 0;
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
/**
 * General Item structure that will be available for all elements, including groups
 *
 *
 */
class BaseItem {
    addActionHandler(contextHandler) {
        this.actionHandlers.push(contextHandler);
    }
    /**
     * Adds the required fields
     * @param item
     */
    _enrich(item) {
        item.icon = this.icon;
        item.type = this.type;
    }
    async _find(itemId, catalogId) {
        let item = await this.find(itemId, catalogId);
        this._enrich(item);
        return item;
    }
    async _getChilds(parentId, catalogId) {
        let items = await this.getChilds(parentId, catalogId);
        items.forEach((item) => {
            this._enrich(item);
        });
        return items;
    }
}
exports.BaseItem = BaseItem;
class AbstractGroup extends BaseItem {
    constructor() {
        // public abstract create(itemId: string, data: T): Promise<T>;
        super(...arguments);
        this.type = "group";
        this.isGroup = true;
        this.icon = "folder";
    }
}
exports.AbstractGroup = AbstractGroup;
class AbstractItem extends BaseItem {
    constructor() {
        super(...arguments);
        this.isGroup = false;
    }
}
exports.AbstractItem = AbstractItem;
/// ContextHandler
class ActionHandler {
}
exports.ActionHandler = ActionHandler;
/**
 *
    Abstract
   ____    _  _____  _    _     ___   ____
  / ___|  / \|_   _|/ \  | |   / _ \ / ___|
 | |     / _ \ | | / _ \ | |  | | | | |  _
 | |___ / ___ \| |/ ___ \| |__| |_| | |_| |
  \____/_/   \_|_/_/   \_|_____\___/ \____|


 */
class AbstractCatalog {
    getLocalizeMessages() {
        let obj = {
            "Delete": "",
            "Edit": "",
            "create": "",
            "Search": "",
            "Select Item type": "",
            "Select Items": "",
            "Save": "",
            "No, cancel": "",
            "Are you sure?": "",
            "Yes, I'm sure": ""
        };
        obj[this.name] = "";
        for (const actionHandler of this.actionHandlers) {
            obj[actionHandler.name] = "";
        }
        return obj;
    }
    /**
     * Method for getting childs elements
     * if pass null as parentId this root
     */
    async getChilds(parentId, byItemType) {
        if (byItemType) {
            const items = await this.getItemType(byItemType)?._getChilds(parentId, this.id);
            return items ? items.sort((a, b) => a.sortOrder - b.sortOrder) : [];
        }
        else {
            let result = [];
            for (const itemType of this.itemTypes) {
                const items = await itemType?._getChilds(parentId, this.id);
                if (items) {
                    result = result.concat(items);
                }
            }
            return result.sort((a, b) => a.sortOrder - b.sortOrder);
        }
    }
    _bindAccessRight() {
        setTimeout(() => {
            const postfix = this.id ? `${this.slug}-${this.id}` : `${this.slug}`;
            accessRightsHelper_1.AccessRightsHelper.registerToken({
                id: `catalog-${postfix}`,
                name: this.name,
                description: `Access to edit catalog for ${postfix}`,
                department: 'catalog'
            });
        }, 100);
    }
    constructor(items) {
        /**
         * moving groups to the root only
         */
        this.movingGroupsRootOnly = false;
        /**
         * List of element types
         */
        this.itemTypes = [];
        for (const item of items) {
            this.additemTypes(item);
        }
        this._bindAccessRight();
    }
    setID(id) {
        this.id = id;
    }
    /**
     * Gettind id list method
     */
    getIdList() {
        return [];
    }
    getItemType(type) {
        return this.itemTypes.find((it) => it.type === type);
    }
    getGroupType() {
        return this.itemTypes.find((it) => it.isGroup === true);
    }
    additemTypes(itemType) {
        if (itemType.isGroup === true &&
            this.itemTypes.find((it) => it.isGroup === true)) {
            throw new Error(`Only one type group is allowed`);
        }
        this.itemTypes.push(itemType);
    }
    /**
     *  Get an element
     */
    find(item) {
        return this.getItemType(item.type)?._find(item.id, this.id);
    }
    /**
     *  Removing an element
     */
    deleteItem(type, id) {
        try {
            this.getItemType(type)?.deleteItem(id, this.id);
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Receives HTML to update an element for projection into a popup
     */
    getEditHTML(item, id, loc, modelId) {
        return this.getItemType(item.type)?.getEditHTML(id, this.id, loc, modelId);
    }
    /**
     * Receives HTML to create an element for projection into a popup
     */
    getAddHTML(item, loc) {
        return this.getItemType(item.type)?.getAddHTML(loc);
    }
    addActionHandler(actionHandler) {
        if (actionHandler.selectedItemTypes.length > 0) {
            for (let actionItem of actionHandler.selectedItemTypes) {
                this.getItemType(actionItem).addActionHandler(actionHandler);
            }
        }
        else {
            this.actionHandlers.push(actionHandler);
        }
    }
    /**
     * Method for getting group elements
     * If there are several Items, then the global ones will be obtained
     */
    async getActions(items) {
        if (items.length === 1) {
            const item = items[0];
            const itemType = this.itemTypes.find((it) => it.type === item.type);
            return itemType.actionHandlers;
        }
        else {
            return this.actionHandlers;
        }
    }
    /**
     * Implements search and execution of a specific action.handler
     */
    async handleAction(actionId, items, config) {
        let action = null;
        if (items.length === 1) {
            const item = items[0];
            const itemType = this.itemTypes.find((it) => it.type === item.type);
            if (itemType.actionHandlers?.length) {
                action = itemType.actionHandlers.find((it) => it.id === actionId);
            }
            else {
                action = this.actionHandlers.find((it) => it.id === actionId);
            }
        }
        else {
            action = this.actionHandlers.find((it) => it.id === actionId);
        }
        // console.log(this.actionHandlers)
        if (!action)
            throw `Action with id \`${actionId}\` not found`;
        return await action.handler(items, config);
    }
    /**
     * Only For a Link action
     * @param actionId
     */
    async getLink(actionId) {
        return this.actionHandlers.find((it) => it.id === actionId)?.getLink();
    }
    /**
     * For Extermal and JsonForms actions
     * @param actionId
     */
    async getPopUpHTML(actionId) {
        return this.actionHandlers.find((it) => it.id === actionId)?.getPopUpHTML();
    }
    /**
     *
     * @param data
     */
    createItem(data) {
        return this.getItemType(data.type)?.create(data, this.id);
    }
    updateItem(id, type, data) {
        return this.getItemType(type)?.update(id, data, this.id);
    }
    /**
     * To update all items in the tree after updating the model
     * @param id
     * @param type
     * @param data
     */
    updateModelItems(modelId, type, data) {
        return this.getItemType(type)?.updateModelItems(modelId, data, this.id);
    }
    /**
     * Method for getting group elements
     */
    getitemTypes() {
        return this.itemTypes;
    }
    ;
    async search(s, hasExtras = true) {
        // Build the trees for all found items
        const accumulator = [];
        // Find group type
        const groupType = this.itemTypes.find((item) => item.isGroup === true);
        // Recursive function to build the tree upwards
        const buildTreeUpwards = async (item, hasExtras) => {
            // Add extras
            if (hasExtras) {
                const extras = await this.getChilds(item.id);
                accumulator.push(...extras);
            }
            if (item.parentId === null)
                return item;
            const parentItem = await groupType._find(item.parentId, this.id);
            if (parentItem) {
                accumulator.push(parentItem);
                return buildTreeUpwards(parentItem, hasExtras);
            }
            return item;
        };
        let foundItems = [];
        // Handle all search
        for (const itemType of this.itemTypes) {
            const items = (await itemType.search(s, this.id)).map(a => ({ ...a, marked: true }));
            foundItems = foundItems.concat(items);
        }
        for (const item of foundItems) {
            if (item.parentId !== null) {
                await buildTreeUpwards(item, hasExtras);
            }
        }
        // finalize
        const itemsMap = new Map();
        // Add accumulated items to the map
        for (const item of accumulator) {
            itemsMap.set(item.id, item);
        }
        // Overwrite found items
        for (const item of foundItems) {
            itemsMap.set(item.id, item);
        }
        // Convert the map to an array of root items
        const rootItems = Array.from(itemsMap.values());
        return rootItems;
    }
    static buildTree(items) {
        const tree = [];
        const itemMap = {};
        items.forEach(item => {
            item.childs = [];
            itemMap[item.id] = item;
        });
        items.forEach(item => {
            if (item.parentId === null) {
                tree.push(item);
            }
            else {
                const parent = itemMap[item.parentId];
                if (parent) {
                    parent.childs.push(item);
                }
            }
        });
        return tree;
    }
}
exports.AbstractCatalog = AbstractCatalog;
