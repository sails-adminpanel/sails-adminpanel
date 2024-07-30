"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = exports.StorageServices = void 0;
const AbstractCatalog_1 = require("../AbstractCatalog");
const fs = require("node:fs");
const ejs = require('ejs');
const uuid_1 = require("uuid");
class StorageService {
    constructor(id, model) {
        this.storageMap = new Map();
        this.id = id;
        this.model = model.toLowerCase();
        this.initModel();
    }
    initModel() {
        sails.models[this.model].findOrCreate({ label: this.id, }, { label: this.id, tree: [] })
            .exec(async (err, navigation, wasCreated) => {
            if (err) {
                throw err;
            }
            if (wasCreated) {
                sails.log(`Created a new navigation: ${this.id}`);
            }
            else {
                sails.log(`Found existing navigation: ${this.id}`);
                await this.populateFromTree(navigation.tree);
            }
        });
    }
    getId() {
        return this.id;
    }
    async buildTree() {
        const rootElements = await this.findElementsByParentId(null, null);
        const buildSubTree = async (elements) => {
            const tree = [];
            for (const element of elements) {
                const children = await this.findElementsByParentId(element.id, null);
                tree.push({
                    ...element,
                    children: await buildSubTree(children)
                });
            }
            return tree;
        };
        let tree = await buildSubTree(rootElements);
        function sortTree(items) {
            items.sort((a, b) => a.sortOrder - b.sortOrder);
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.children) {
                    sortTree(item.children);
                }
            }
        }
        sortTree(tree);
        return tree;
    }
    async populateFromTree(tree) {
        const traverseTree = async (node, parentId = null) => {
            const { children, ...itemData } = node;
            const item = { ...itemData, parentId };
            await this.setElement(item.id, item);
            if (children && children.length > 0) {
                for (const child of children) {
                    await traverseTree(child, item.id);
                }
            }
        };
        for (const node of tree) {
            await traverseTree(node);
        }
    }
    async setElement(id, item) {
        this.storageMap.set(item.id, item);
        await this.saveToDB();
        // This like fetch in DB
        return this.findElementById(item.id);
    }
    async removeElementById(id) {
        this.storageMap.delete(id);
        setTimeout(async () => {
            await this.saveToDB();
        }, 500);
    }
    async findElementById(id) {
        return this.storageMap.get(id);
    }
    async findElementByModelId(modelId) {
        const elements = [];
        for (const item of this.storageMap.values()) {
            if (item.modelId === modelId) {
                elements.push(item);
            }
        }
        return elements;
    }
    async saveToDB() {
        let tree = await this.buildTree();
        try {
            await sails.models[this.model].update({ label: this.id }, { tree: tree });
        }
        catch (e) {
            console.log(e);
            throw 'navigation model update error';
        }
    }
    async findElementsByParentId(parentId, type) {
        const elements = [];
        for (const item of this.storageMap.values()) {
            // Assuming each item has a parentId property
            if (type === null && item.parentId === parentId) {
                elements.push(item);
                continue;
            }
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
    static getAll() {
        return this.storages;
    }
}
exports.StorageServices = StorageServices;
StorageServices.storages = [];
class Navigation extends AbstractCatalog_1.AbstractCatalog {
    constructor(config) {
        let items = [];
        for (const configElement of config.items) {
            items.push(new NavigationItem(configElement.name, configElement.model, config.model, configElement.urlPath));
        }
        items.push(new NavigationGroup(config.groupField));
        items.push(new LinkItem());
        for (const section of config.sections) {
            StorageServices.add(new StorageService(section, config.model));
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
        this.actionHandlers = [];
        this.name = name;
        this.navigationModel = navigationModel;
        this.model = model.toLowerCase();
        this.type = model.toLowerCase();
        this.urlPath = urlPath;
        let configModel = sails.config.adminpanel.models[this.model];
        this.icon = configModel.icon ?? 'file';
    }
    async create(data, catalogId) {
        let storage = StorageServices.get(catalogId);
        let storageData = null;
        if (data._method === 'select') {
            let record = await sails.models[this.model].findOne({ id: data.record });
            storageData = await this.dataPreparation({
                record: record,
                parentId: data.parentId,
                targetBlank: data.targetBlank
            }, catalogId);
        }
        else {
            storageData = await this.dataPreparation(data, catalogId);
        }
        return await storage.setElement(data.id, storageData);
    }
    async dataPreparation(data, catalogId, sortOrder) {
        let storage = StorageServices.get(catalogId);
        let urlPath = eval('`' + this.urlPath + '`');
        let parentId = data.parentId ? data.parentId : null;
        return {
            id: (0, uuid_1.v4)(),
            modelId: data.record.id,
            targetBlank: data.targetBlank ?? data.record.targetBlank,
            name: data.record.name ?? data.record.title ?? data.record.id,
            parentId: parentId,
            sortOrder: sortOrder ?? (await storage.findElementsByParentId(parentId, null)).length,
            icon: this.icon,
            type: this.type,
            urlPath: urlPath
        };
    }
    async updateModelItems(modelId, data, catalogId) {
        let storage = StorageServices.get(catalogId);
        let items = await storage.findElementByModelId(modelId);
        let urlPath = eval('`' + this.urlPath + '`');
        for (const item of items) {
            item.name = data.record.name;
            item.urlPath = urlPath;
            if (item.id === data.record.treeId) {
                item.targetBlank = data.record.targetBlank;
            }
            await storage.setElement(item.id, item);
        }
        return Promise.resolve(undefined);
    }
    async update(itemId, data, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.setElement(itemId, data);
    }
    async deleteItem(itemId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.removeElementById(itemId);
    }
    async find(itemId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementById(itemId);
    }
    async getAddHTML() {
        let type = 'html';
        let items = await sails.models[this.model].find();
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/itemHTMLAdd.ejs`, 'utf8'), {
                items: items,
                item: { name: this.name, type: this.type, model: this.model }
            }),
        };
    }
    async getChilds(parentId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementsByParentId(parentId, this.type);
    }
    async getEditHTML(id, catalogId, modelId) {
        let item = await this.find(id, catalogId);
        let type = 'html';
        return Promise.resolve({
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/itemHTMLEdit.ejs`, 'utf8'), { item: item })
        });
    }
    async search(s, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.search(s, this.type);
    }
}
class NavigationGroup extends AbstractCatalog_1.AbstractGroup {
    constructor(groupField) {
        super();
        this.allowedRoot = true;
        this.name = "Group";
        this.groupField = groupField;
    }
    async create(data, catalogId) {
        let storage = StorageServices.get(catalogId);
        let storageData = await this.dataPreparation(data, catalogId);
        delete data.name;
        delete data.parentId;
        storageData = { ...storageData, ...data };
        return await storage.setElement(storageData.id, storageData);
    }
    async dataPreparation(data, catalogId, sortOrder) {
        let storage = StorageServices.get(catalogId);
        let parentId = data.parentId ? data.parentId : null;
        return {
            id: (0, uuid_1.v4)(),
            name: data.name,
            targetBlank: data.targetBlank,
            parentId: parentId,
            sortOrder: sortOrder ?? (await storage.findElementsByParentId(parentId, null)).length,
            icon: this.icon,
            type: this.type
        };
    }
    async deleteItem(itemId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.removeElementById(itemId);
    }
    async find(itemId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementById(itemId);
    }
    async update(itemId, data, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.setElement(itemId, data);
    }
    async updateModelItems(modelId, data, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.setElement(modelId, data);
    }
    getAddHTML() {
        let type = 'html';
        return Promise.resolve({
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/GroupHTMLAdd.ejs`, 'utf8'), { fields: this.groupField }),
        });
    }
    async getChilds(parentId, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.findElementsByParentId(parentId, this.type);
    }
    async getEditHTML(id, catalogId) {
        let type = 'html';
        let item = await this.find(id, catalogId);
        return Promise.resolve({
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/GroupHTMLEdit.ejs`, 'utf8'), {
                fields: this.groupField,
                item: item
            }),
        });
    }
    async search(s, catalogId) {
        let storage = StorageServices.get(catalogId);
        return await storage.search(s, this.type);
    }
}
class LinkItem extends NavigationGroup {
    constructor() {
        super([]);
        this.allowedRoot = true;
        this.icon = 'external-link-alt';
        this.name = 'Link';
        this.type = 'link';
        this.isGroup = false;
    }
    getAddHTML() {
        let type = 'html';
        return Promise.resolve({
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/LinkItemAdd.ejs`, 'utf8')),
        });
    }
    async getEditHTML(id, catalogId) {
        let type = 'html';
        let item = await this.find(id, catalogId);
        return Promise.resolve({
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/LinkItemEdit.ejs`, 'utf8'), {
                fields: this.groupField,
                item: item
            }),
        });
    }
}
