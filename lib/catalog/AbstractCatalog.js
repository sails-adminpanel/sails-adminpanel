"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = exports.ActionHandler = exports.AbstractItem = exports.AbstractGroup = exports.BaseItem = void 0;
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
class AbstractGroup extends BaseItem {
    constructor() {
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
    /**
     * Method for getting childs elements
     * if pass null as parentId this root
     */
    async getChilds(parentId, byItemType) {
        if (byItemType) {
            const items = await this.getItemType(byItemType)?.getChilds(parentId);
            return items ? items.sort((a, b) => a.sortOrder - b.sortOrder) : [];
        }
        else {
            let result = [];
            for (const itemType of this.itemTypes) {
                const items = await itemType?.getChilds(parentId);
                if (items) {
                    result = result.concat(items);
                }
            }
            return result.sort((a, b) => a.sortOrder - b.sortOrder);
        }
    }
    constructor(items) {
        /**
         * List of element types
         */
        this.itemTypes = [];
        for (const item of items) {
            this.additemTypes(item);
        }
    }
    setID(id) {
        this.id = id;
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
         *  Removing an element
         */
    find(item) {
        return this.getItemType(item.type)?.find(item.id);
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
    updateItem(id, type, data) {
        return this.getItemType(type)?.update(id, data);
    }
    /**
     * Method for getting group elements
     */
    getitemTypes() {
        return this.itemTypes;
    }
    ;
    async search(s) {
        let foundItems = [];
        // Handle all search
        for (const itemType of this.itemTypes) {
            const items = await itemType.search(s);
            foundItems = foundItems.concat(items);
        }
        // Find group type
        const groupType = this.itemTypes.find((item) => item.isGroup === true);
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
