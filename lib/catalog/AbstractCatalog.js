"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = exports.ActionHandler = exports.ItemType = exports.GroupType = exports.BaseItem = void 0;
/**
 * General Item structure that will be available for all elements, including groups
 *
 *
 */
class BaseItem {
    addActionHandler(contextHandler) {
        this.actionHandlers.push(contextHandler);
    }
}
exports.BaseItem = BaseItem;
class GroupType extends BaseItem {
    constructor() {
        super(...arguments);
        this.isGroup = true;
    }
}
exports.GroupType = GroupType;
class ItemType extends BaseItem {
    constructor() {
        super(...arguments);
        this.isGroup = false;
    }
}
exports.ItemType = ItemType;
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
    constructor(items) {
        /**
         * List of element types
         */
        this.itemsType = [];
        for (const item of items) {
            this.addItemsType(item);
        }
    }
    setID(id) {
        this.id = id;
    }
    getItemType(type) {
        return this.itemsType.find((it) => it.type === type);
    }
    addItemsType(itemType) {
        if (itemType.isGroup === true &&
            this.itemsType.find((it) => it.isGroup === true)) {
            throw new Error(`Only one type group is allowed`);
        }
        this.itemsType.push(itemType);
    }
    /**
     * Method for change sortion order for group and items
     */
    async setSortOrder(item, sortOrder) {
        return await this.getItemType(item.type)?.setSortOrder(item.id, sortOrder);
    }
    /**
     *  Removing an element
     */
    deleteItem(item) {
        this.getItemType(item.type)?.deleteItem(item.id);
    }
    /**
     * Receives HTML to update an element for projection into a popup
     */
    getEditHTML(item) {
        this.getItemType(item.type)?.getEditHTML(item.id);
    }
    /**
     * Receives HTML to create an element for projection into a popup
     */
    getAddHTML(item) {
        return this.getItemType(item.type)?.getAddHTML();
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
            const itemType = this.itemsType.find((it) => it.type === item.type);
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
            const itemType = this.itemsType.find((it) => it.type === item.type);
            action = itemType.actionHandlers.find((it) => it.id === actionId);
        }
        else {
            action = this.actionHandlers.find((it) => it.id === actionId);
        }
        if (!action)
            throw `Action with id \`${actionId}\` not found`;
        return await action.handler(items, config);
    }
    createItem(data) {
        return this.getItemType(data.type)?.create(this.id, data);
    }
    updateItem(id, data) {
        return this.getItemType(data.type)?.update(id, data);
    }
    /**
     * Method for getting group elements
     */
    getItemsType() {
        return this.itemsType;
    }
    ;
    /**
     * @deprecated use `getItemsType()`
         * Method for getting group elements
         */
    getItems() {
        return this.itemsType;
    }
    ;
    getCreatedItems(itemTypeId) {
        return this.getItemType(itemTypeId)?.getCreatedItems(this.id);
    }
    async search(s) {
        let foundItems = [];
        // Handle all search
        for (const itemType of this.itemsType) {
            const items = await itemType.search(s);
            foundItems = foundItems.concat(items);
        }
        // Find group type
        const groupType = this.itemsType.find((item) => item.isGroup === true);
        // Recursive function to build the tree upwards
        const buildTreeUpwards = async (item, accumulator) => {
            if (item.parentId === null)
                return item;
            const parentItem = await groupType.find(item.parentId);
            if (parentItem) {
                accumulator.push(parentItem);
                return buildTreeUpwards(parentItem, accumulator);
            }
            return item;
        };
        // Build the trees for all found items
        const itemsMap = new Map();
        const accumulator = [];
        for (const item of foundItems) {
            itemsMap.set(item.id, item);
            if (item.parentId !== null) {
                await buildTreeUpwards(item, accumulator);
            }
        }
        // Add accumulated items to the map
        for (const item of accumulator) {
            itemsMap.set(item.id, item);
        }
        // Convert the map to an array of root items
        const rootItems = Array.from(itemsMap.values());
        return rootItems;
    }
}
exports.AbstractCatalog = AbstractCatalog;
