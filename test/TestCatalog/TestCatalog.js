"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCatalog = exports.Item2 = exports.Item1 = exports.TestGroup = exports.StorageService = void 0;
const AbstractCatalog_1 = require("../../lib/catalog/AbstractCatalog");
/**
 * Storage takes place in RAM
 */
class StorageService {
    static async setElement(id, item) {
        this.storageMap.set(item.id, item);
        // This like fetch in DB
        return this.findElementById(item.id);
    }
    static async removeElementById(id) {
        this.storageMap.delete(id);
    }
    static async findElementById(id) {
        return this.storageMap.get(id);
    }
    static async findElementsByParentId(parentId, type) {
        const elements = [];
        for (const item of this.storageMap.values()) {
            // Assuming each item has a parentId property
            if (item.parentId === parentId && item.type === type) {
                elements.push(item);
            }
        }
        return elements;
    }
    static async getAllElements() {
        return Array.from(this.storageMap.values());
    }
    static async search(s, type) {
        const lowerCaseQuery = s.toLowerCase(); // Convert query to lowercase for case-insensitive search
        const matchedElements = [];
        for (const item of this.storageMap.values()) {
            // Check if item type matches the specified type
            if (item.type === type) {
                // Search by name
                if (item.name.toLowerCase().includes(lowerCaseQuery)) {
                    matchedElements.push(item);
                }
            }
        }
        return matchedElements;
    }
}
exports.StorageService = StorageService;
StorageService.storageMap = new Map();
/**
 *
 _____         _    ____
|_   _|__  ___| |_ / ___|_ __ ___  _   _ _ __
  | |/ _ \/ __| __| |  _| '__/ _ \| | | | '_ \
  | |  __/\__ \ |_| |_| | | | (_) | |_| | |_) |
  |_|\___||___/\__|\____|_|  \___/ \__,_| .__/
                                        |_|
 */
class TestGroup extends AbstractCatalog_1.AbstractGroup {
    constructor() {
        super(...arguments);
        this.name = "Group";
    }
    async find(itemId) {
        return await StorageService.findElementById(itemId);
    }
    async update(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    ;
    async create(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    async deleteItem(itemId) {
        return await StorageService.removeElementById(itemId);
    }
    // TODO rename this
    getAddHTML() {
        throw new Error("Method not implemented.");
    }
    getEditHTML(id) {
        throw new Error("Method not implemented.");
    }
    async getChilds(parentId) {
        return await StorageService.findElementsByParentId(parentId, this.type);
    }
    async search(s) {
        return await StorageService.search(s, this.type);
    }
}
exports.TestGroup = TestGroup;
/**
 ___ _                 _
|_ _| |_ ___ _ __ ___ / |
 | || __/ _ \ '_ ` _ \| |
 | || ||  __/ | | | | | |
|___|\__\___|_| |_| |_|_|
 */
class Item1 extends AbstractCatalog_1.AbstractItem {
    constructor() {
        super(...arguments);
        this.type = "item1";
        this.name = "Item 1";
        this.allowedRoot = true;
        this.icon = "file";
    }
    async find(itemId) {
        return await StorageService.findElementById(itemId);
    }
    async update(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    ;
    async create(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    async deleteItem(itemId) {
        return await StorageService.removeElementById(itemId);
    }
    getAddHTML() {
        throw new Error("Method not implemented.");
    }
    getEditHTML(id) {
        throw new Error("Method not implemented.");
    }
    async getChilds(parentId) {
        return await StorageService.findElementsByParentId(parentId, this.type);
    }
    async search(s) {
        return await StorageService.search(s, this.type);
    }
}
exports.Item1 = Item1;
class Item2 extends Item1 {
    constructor() {
        super(...arguments);
        this.type = "item2";
        this.name = "Item 2";
        this.allowedRoot = true;
        this.icon = "file";
    }
}
exports.Item2 = Item2;
class TestCatalog extends AbstractCatalog_1.AbstractCatalog {
    //  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];
    constructor() {
        super([
            new TestGroup(),
            new Item1(),
            new Item2()
        ]);
        this.name = "test catalog";
        this.slug = "test";
        this.maxNestingDepth = null;
        this.icon = "box";
    }
}
exports.TestCatalog = TestCatalog;
