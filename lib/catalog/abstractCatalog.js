"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = exports.ActionHandler = exports.ItemType = exports.GroupType = exports.BaseItem = void 0;
/**
 * General Item structure that will be available for all elements, including groups
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
/// AbstractCatalog
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
        // Возможно что страницы будут иметь ссылки внутри
        // if (
        //   itemType.isGroup === true &&
        //   this.itemsType.find((it) => it.isGroup === true)
        // ) {
        //   throw new Error(`Only one type group is allowed`);
        // }
        this.itemsType.push(itemType);
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
    createItem(item, data) {
        return this.getItemType(item.type)?.create(this.id, data);
    }
    updateItem(item, id, data) {
        return this.getItemType(item.type)?.update(id, data);
    }
    /**
     * Method for getting group elements
     */
    getItems() {
        return this.itemsType;
    }
    ;
    getCreatedItems(item) {
        return this.getItemType(item.type)?.getCreatedItems(this.id);
    }
}
exports.AbstractCatalog = AbstractCatalog;