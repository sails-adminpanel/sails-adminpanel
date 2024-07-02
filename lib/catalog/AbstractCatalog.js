"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = void 0;
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
            const itemType = this.itemsType.find((it) => it.id === item.type);
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
            const itemType = this.itemsType.find((it) => it.id === item.type);
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
        // Find all group types
        const groupTypes = this.itemsType.find((item) => item.isGroup === true);
        // handle all search
        for (const itemType of this.itemsType) {
            foundItems = foundItems.concat(await itemType.search(s));
        }
        return foundItems;
    }
}
exports.AbstractCatalog = AbstractCatalog;
