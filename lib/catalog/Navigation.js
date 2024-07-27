"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGroup = exports.NavigationItem = exports.Navigation = void 0;
const AbstractCatalog_1 = require("./AbstractCatalog");
const fs = require("node:fs");
const ejs = require('ejs');
const uuid_1 = require("uuid");
class StorageService {
    constructor(id) {
        this.storageMap = new Map();
        this.id = id;
    }
    getId() {
        return this.id;
    }
    async setElement(id, item) {
        this.storageMap.set(item.id, item);
        // This like fetch in DB
        return this.findElementById(item.id);
    }
    async removeElementById(id) {
        this.storageMap.delete(id);
    }
    async findElementById(id) {
        return this.storageMap.get(id);
    }
    async findElementsByParentId(parentId, type) {
        const elements = [];
        for (const item of this.storageMap.values()) {
            // Assuming each item has a parentId property
            if (item.parentId === parentId && item.type === type) {
                elements.push(item);
            }
        }
        return elements;
    }
    async getAllElements() {
        return Array.from(this.storageMap.values());
    }
    async search(s, type) {
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
class StorageServices {
    static add(storage) {
        this.storages.push(storage);
    }
    static get(id) {
        return this.storages.find(storage => storage.getId() === id);
    }
}
StorageServices.storages = [];
class Navigation extends AbstractCatalog_1.AbstractCatalog {
    constructor(config) {
        let items = [];
        for (const configElement of config.items) {
            items.push(new NavigationItem(configElement.name, configElement.model, config.model, configElement.urlPath));
        }
        items.push(new NavigationGroup(config.groupField));
        for (const section of config.sections) {
            StorageServices.add(new StorageService(section));
        }
        super(items);
        this.name = 'Navigation';
        this.slug = 'navigation';
        this.icon = "box";
        this.actionHandlers = [];
    }
}
exports.Navigation = Navigation;
class NavigationItem extends AbstractCatalog_1.AbstractItem {
    constructor(name, model, navigationModel, urlPath) {
        super();
        this.allowedRoot = true;
        this.icon = 'file';
        this.actionHandlers = [];
        this.name = name;
        this.navigationModel = navigationModel;
        this.model = model.toLowerCase();
        this.type = model.toLowerCase();
        this.urlPath = urlPath;
    }
    async create(data, catalogId) {
        let storage = StorageServices.get(catalogId);
        let urlPath = eval('`' + this.urlPath + '`');
        let storageData = {
            id: data.record.id,
            name: data.record.name ?? data.record.title ?? data.record.id,
            parentId: data.parentId ? data.parentId : null,
            sortOrder: 0,
            icon: this.icon,
            type: this.type,
            urlPath: urlPath
        };
        return await storage.setElement(data.id, storageData);
    }
    deleteItem(itemId, catalogId) {
        return Promise.resolve(undefined);
    }
    async find(itemId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementById(itemId);
    }
    getAddHTML() {
        let type = 'link';
        return {
            type: type,
            data: `/admin/model/${this.model}/add?without_layout=true`
        };
    }
    async getChilds(parentId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementsByParentId(parentId, this.type);
    }
    getEditHTML(id) {
        return Promise.resolve({ data: "", type: undefined });
    }
    search(s, catalogId) {
        return Promise.resolve([]);
    }
    update(itemId, data, catalogId) {
        return Promise.resolve(undefined);
    }
}
exports.NavigationItem = NavigationItem;
class NavigationGroup extends AbstractCatalog_1.AbstractGroup {
    constructor(groupField) {
        super();
        this.allowedRoot = true;
        this.name = "Group";
        this.groupField = groupField;
    }
    async create(data, catalogId) {
        let storage = StorageServices.get(catalogId);
        let storageData = {
            id: (0, uuid_1.v4)(),
            name: data.name,
            parentId: data.parentId ? data.parentId : null,
            sortOrder: 0,
            icon: this.icon,
            type: this.type
        };
        delete data.name;
        delete data.parentId;
        storageData = { ...storageData, ...data };
        return await storage.setElement(storageData.id, storageData);
    }
    deleteItem(itemId, catalogId) {
        return Promise.resolve(undefined);
    }
    find(itemId, catalogId) {
        return Promise.resolve(undefined);
    }
    getAddHTML() {
        let type = 'html';
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/GroupHTMLAdd.ejs`, 'utf8'), { fields: this.groupField }),
        };
    }
    async getChilds(parentId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementsByParentId(parentId, this.type);
    }
    getEditHTML(id) {
        return Promise.resolve({ data: "", type: undefined });
    }
    search(s, catalogId) {
        return Promise.resolve([]);
    }
    update(itemId, data, catalogId) {
        return Promise.resolve(undefined);
    }
}
exports.NavigationGroup = NavigationGroup;
