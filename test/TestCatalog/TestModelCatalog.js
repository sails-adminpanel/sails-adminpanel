"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAction = exports.Link = exports.TestCatalog = exports.Page = exports.Item2 = exports.TestGroup = exports.StorageService = void 0;
const AbstractCatalog_2 = require("../../lib/catalog/AbstractCatalog");
const fs = require("node:fs");
const ejs = require('ejs');
const filepath = './.tmp/public/files';
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
class TestGroup extends AbstractCatalog_2.AbstractGroup {
    constructor() {
        super(...arguments);
        this.name = "Group";
        this.allowedRoot = true;
        this.icon = 'audio-description';
        this.type = 'group';
        this.isGroup = true;
        this.actionHandlers = [];
    }
    async find(itemId) {
        return await StorageService.findElementById(itemId);
    }
    async update(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    ;
    async create(itemId, data) {
        let elems = await StorageService.getAllElements();
        let id = elems.length + 1;
        let newData = {
            ...data,
            id: id.toString(),
            sortOrder: id
        };
        return await StorageService.setElement(id, newData);
    }
    async deleteItem(itemId) {
        await StorageService.removeElementById(itemId);
    }
    getAddHTML() {
        let type = 'html';
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/groupAdd.ejs`, 'utf8')),
        };
    }
    async getEditHTML(id) {
        let type = 'html';
        let item = await StorageService.findElementById(id);
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/groupEdit.ejs`, 'utf8'), { item: item }),
        };
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
class Item2 extends AbstractCatalog_2.AbstractItem {
    constructor() {
        super(...arguments);
        this.type = "item2";
        this.name = "Item 2";
        this.allowedRoot = true;
        this.icon = "radiation-alt";
        this.actionHandlers = [];
    }
    getAddHTML() {
        let type = 'html';
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/item2Add.ejs`, 'utf8')),
        };
    }
    async getEditHTML(id) {
        let type = 'html';
        let item = await StorageService.findElementById(id);
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/item2Edit.ejs`, 'utf8'), { item: item }),
        };
    }
    async create(itemId, data) {
        let elems = await StorageService.getAllElements();
        let id = elems.length + 1;
        let newData = {
            ...data,
            id: id.toString(),
            sortOrder: id
        };
        return await StorageService.setElement(id, newData);
    }
    async find(itemId) {
        return await StorageService.findElementById(itemId);
    }
    async update(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    ;
    async deleteItem(itemId) {
        await StorageService.removeElementById(itemId);
    }
    async getChilds(parentId) {
        return await StorageService.findElementsByParentId(parentId, this.type);
    }
    async search(s) {
        return await StorageService.search(s, this.type);
    }
}
exports.Item2 = Item2;
class Page extends AbstractCatalog_2.AbstractItem {
    constructor() {
        super(...arguments);
        this.type = "page";
        this.name = "Page";
        this.allowedRoot = true;
        this.icon = "file";
        this.actionHandlers = [];
    }
    async find(itemId) {
        return await sails.models['page'].findOne({ id: itemId });
    }
    async update(itemId, data) {
        // allowed only parentID update
        return await sails.models['page'].update({ id: itemId }, { name: data.name, parentId: data.parentId }).fetch();
    }
    ;
    async create(itemId, data) {
        throw `I dont know for what need it`;
        // return await sails.models.create({ name: data.name, parentId: data.parentId}).fetch();
        // return await StorageService.setElement(itemId, data);
    }
    async deleteItem(itemId) {
        await sails.models['page'].destroy({ id: itemId });
        //	await StorageService.removeElementById(itemId);
    }
    getAddHTML() {
        let type = 'link';
        return {
            type: type,
            data: '/admin/model/page/add?without_layout=true'
        };
    }
    async getEditHTML(id) {
        let type = 'link';
        return {
            type: type,
            data: `/admin/model/page/edit/${id}?without_layout=true`
        };
    }
    // TODO: Need rename (getChilds) it not intuitive
    async getChilds(parentId) {
        return await sails.models['page'].find({ parentID: parentId });
    }
    async search(s) {
        return await sails.models['page'].find({ name: { contain: s } });
    }
}
exports.Page = Page;
class TestCatalog extends AbstractCatalog_2.AbstractCatalog {
    //  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];
    constructor() {
        super([
            new TestGroup(),
            new Item2(),
            new Page()
        ]);
        this.name = "test catalog";
        this.slug = "test";
        this.maxNestingDepth = null;
        this.icon = "box";
        this.actionHandlers = [];
        this.addActionHandler(new Link());
        this.addActionHandler(new ContextAction());
    }
}
exports.TestCatalog = TestCatalog;
class Link extends AbstractCatalog_2.ActionHandler {
    constructor() {
        super(...arguments);
        this.icon = 'cat';
        this.id = 'download';
        this.name = 'Link';
        this.displayTool = true;
        this.displayContext = false;
        this.type = 'link';
        this.selectedItemTypes = [];
    }
    getLink() {
        return Promise.resolve("");
    }
    getPopUpHTML() {
        return Promise.resolve("");
    }
    handler(items, config) {
        return Promise.resolve({
            data: 'http://www.example.com/',
            type: this.type
        });
    }
}
exports.Link = Link;
class ContextAction extends AbstractCatalog_2.ActionHandler {
    constructor() {
        super(...arguments);
        this.icon = 'crow';
        this.id = 'context1';
        this.name = 'Rename';
        this.displayTool = false;
        this.displayContext = true;
        this.type = 'basic';
        this.selectedItemTypes = [
            'group',
            'item2'
        ];
    }
    getLink() {
        return Promise.resolve("");
    }
    getPopUpHTML() {
        return Promise.resolve("");
    }
    handler(items, config) {
        const generateRandomString = () => {
            return Math.floor(Math.random() * Date.now()).toString(36);
        };
        setTimeout(async () => {
            for (const item of items) {
                let data = item;
                data.name = generateRandomString();
                await StorageService.setElement(item.id, data);
            }
        }, 10000);
        return Promise.resolve({
            data: 'ok',
            type: this.type
        });
    }
}
exports.ContextAction = ContextAction;
