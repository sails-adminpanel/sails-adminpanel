"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFormAction = exports.HTMLAction = exports.ContextAction = exports.Link = exports.TestModelCatalog = exports.ItemJsonForm = exports.ItemHTML = exports.Page = exports.ModelGroup = void 0;
const AbstractCatalog_1 = require("../../lib/catalog/AbstractCatalog");
const fs = require("node:fs");
const TestCatalog_1 = require("./TestCatalog");
const sails_typescript_1 = require("sails-typescript");
const ejs = require('ejs');
class BaseModelItem extends AbstractCatalog_1.AbstractItem {
    constructor() {
        super(...arguments);
        this.type = "page";
        this.name = "Page";
        this.allowedRoot = true;
        this.icon = "file";
        this.model = null;
        this.actionHandlers = [];
    }
    async find(itemId) {
        return await sails_typescript_1.default.models[this.model].findOne({ id: itemId });
    }
    async update(itemId, data) {
        // allowed only parentId update
        return await sails_typescript_1.default.models[this.model].update({ id: itemId }, { name: data.name, parentId: data.parentId }).fetch();
    }
    ;
    // @ts-ignore
    create(catalogId, data) {
        return Promise.resolve(undefined);
    }
    // public async create(itemId: string, data: Item): Promise<Item> {
    // 	throw `I dont know for what need it`
    // 	// return await sails.models.create({ name: data.name, parentId: data.parentId}).fetch();
    // 	// return await StorageService.setElement(itemId, data);
    // }
    async deleteItem(itemId) {
        await sails_typescript_1.default.models[this.model].destroy({ id: itemId });
        //	await StorageService.removeElementById(itemId);
    }
    getAddHTML() {
        let type = 'link';
        return Promise.resolve({
            type: type,
            data: `/admin/model/${this.model}/add?without_layout=true`
        });
    }
    async getEditHTML(id, parenId) {
        let type = 'link';
        return {
            type: type,
            data: `/admin/model/${this.model}/edit/${id}?without_layout=true`
        };
    }
    // TODO: Need rename (getChilds) it not intuitive
    async getChilds(parentId) {
        if (parentId === null)
            parentId = "";
        // console.log(this.type, parentId, await sails.models[this.model].find({parentId: parentId}))
        return await sails_typescript_1.default.models[this.model].find({ parentId: parentId });
    }
    async search(s) {
        return await sails_typescript_1.default.models[this.model].find({ name: { contains: s } });
    }
    updateModelItems(itemId, data, catalogId) {
        return Promise.resolve(undefined);
    }
}
class ModelGroup extends BaseModelItem {
    constructor() {
        super(...arguments);
        this.name = "Group";
        this.allowedRoot = true;
        this.icon = 'audio-description';
        this.type = 'group';
        this.isGroup = true;
        this.model = "group";
        this.actionHandlers = [];
    }
}
exports.ModelGroup = ModelGroup;
class Page extends BaseModelItem {
    constructor() {
        super(...arguments);
        this.name = "Page";
        this.allowedRoot = true;
        this.icon = 'file';
        this.type = 'page';
        this.model = "page";
        this.actionHandlers = [];
    }
}
exports.Page = Page;
class ItemHTML extends AbstractCatalog_1.AbstractItem {
    constructor() {
        super(...arguments);
        this.allowedRoot = false;
        this.name = 'ItemHTML';
        this.icon = 'cat';
        this.type = 'itemHTML';
        this.actionHandlers = [];
    }
    getAddHTML() {
        let type = 'html';
        return Promise.resolve({
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/itemHMLAdd.ejs`, 'utf8')),
        });
    }
    async getEditHTML(id) {
        let type = 'html';
        let item = await TestCatalog_1.StorageService.findElementById(id);
        return {
            type: type,
            data: ejs.render(fs.readFileSync(`${__dirname}/itemHTMLEdit.ejs`, 'utf8'), { item: item }),
        };
    }
    // @ts-ignore
    async create(itemId, data) {
        let elems = await TestCatalog_1.StorageService.getAllElements();
        let id = elems.length + 1;
        let newData = {
            ...data,
            id: id.toString(),
            sortOrder: id,
            icon: this.icon
        };
        return await TestCatalog_1.StorageService.setElement(id, newData);
    }
    async find(itemId) {
        return await TestCatalog_1.StorageService.findElementById(itemId);
    }
    async update(itemId, data) {
        return await TestCatalog_1.StorageService.setElement(itemId, data);
    }
    ;
    async deleteItem(itemId) {
        await TestCatalog_1.StorageService.removeElementById(itemId);
    }
    async getChilds(parentId) {
        return await TestCatalog_1.StorageService.findElementsByParentId(parentId, this.type);
    }
    async search(s) {
        return await TestCatalog_1.StorageService.search(s, this.type);
    }
    updateModelItems(itemId, data, catalogId) {
        return Promise.resolve(undefined);
    }
}
exports.ItemHTML = ItemHTML;
class ItemJsonForm extends ItemHTML {
    constructor() {
        super(...arguments);
        this.name = 'ItemJsonForm';
        this.icon = 'radiation-alt';
        this.type = 'itemJsonForm';
    }
    getAddHTML() {
        let type = 'jsonForm';
        let schema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                },
            }
        };
        let UISchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": "Item JsonForm name",
                    "scope": "#/properties/name"
                }
            ]
        };
        let itemType = this.type;
        return Promise.resolve({
            type: type,
            data: JSON.stringify({ schema: schema, UISchema: UISchema, type: itemType }),
        });
    }
    async getEditHTML(id) {
        let item = await this.find(id);
        let type = 'jsonForm';
        let schema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                },
                "id": {
                    "type": "string"
                },
                "parentId": {
                    "type": "string"
                }
            }
        };
        let UISchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": "Item JsonForm name",
                    "scope": "#/properties/name"
                },
                {
                    "type": "Control",
                    "scope": "#/properties/id",
                    "rule": {
                        "effect": "HIDE",
                        "condition": {
                            "scope": "#",
                            "schema": {}
                        }
                    }
                },
                {
                    "type": "Control",
                    "scope": "#/properties/parentId",
                    "rule": {
                        "effect": "HIDE",
                        "condition": {
                            "scope": "#",
                            "schema": {}
                        }
                    }
                }
            ]
        };
        let data = {
            "name": item.name,
            "id": id,
            "parentId": item.parentId
        };
        let itemType = this.type;
        return {
            type: type,
            data: JSON.stringify({ schema: schema, UISchema: UISchema, type: itemType, data: data }),
        };
    }
}
exports.ItemJsonForm = ItemJsonForm;
class TestModelCatalog extends AbstractCatalog_1.AbstractCatalog {
    //  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];
    constructor() {
        super([
            new ModelGroup(),
            new Page(), // @ts-ignore
            new ItemHTML(), // @ts-ignore
            new ItemJsonForm()
        ]);
        this.name = "test model catalog";
        this.slug = "testModel";
        this.maxNestingDepth = null;
        this.icon = "box";
        this.actionHandlers = [];
        this.addActionHandler(new Link());
        this.addActionHandler(new ContextAction());
        this.addActionHandler(new HTMLAction());
        this.addActionHandler(new JsonFormAction());
    }
}
exports.TestModelCatalog = TestModelCatalog;
class Link extends AbstractCatalog_1.ActionHandler {
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
        return Promise.resolve('https://www.example.com/');
    }
    getPopUpHTML() {
        return Promise.resolve("");
    }
    handler(items, data) {
        return Promise.resolve(undefined);
    }
}
exports.Link = Link;
class ContextAction extends AbstractCatalog_1.ActionHandler {
    constructor() {
        super(...arguments);
        this.icon = 'crow';
        this.id = 'context1';
        this.name = 'Rename';
        this.displayTool = false;
        this.displayContext = true;
        this.type = 'basic';
        this.selectedItemTypes = [
            'group'
        ];
    }
    getLink() {
        return Promise.resolve("");
    }
    getPopUpHTML() {
        return Promise.resolve("");
    }
    handler(items, data) {
        console.log(items, data);
        const generateRandomString = () => {
            return Math.floor(Math.random() * Date.now()).toString(36);
        };
        setTimeout(async () => {
            for (const item of items) {
                let name = generateRandomString();
                await sails_typescript_1.default.models['group'].update({ id: item.id }, { name: name });
            }
        }, 10000);
        return Promise.resolve(undefined);
    }
}
exports.ContextAction = ContextAction;
class HTMLAction extends AbstractCatalog_1.ActionHandler {
    constructor() {
        super(...arguments);
        this.icon = 'cat';
        this.id = 'html_action';
        this.name = 'HTMLAction';
        this.displayTool = true;
        this.displayContext = true;
        this.type = 'external';
        this.selectedItemTypes = [];
    }
    getLink() {
        return Promise.resolve("");
    }
    getPopUpHTML() {
        return Promise.resolve(ejs.render(fs.readFileSync(`${__dirname}/actionHTML.ejs`, 'utf8')));
    }
    async handler(items, data) {
        console.log('HTMLAction handler items: ', items);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ ok: true });
            }, 5000);
        });
    }
}
exports.HTMLAction = HTMLAction;
class JsonFormAction extends AbstractCatalog_1.ActionHandler {
    constructor() {
        super(...arguments);
        this.icon = 'crow';
        this.id = 'json-form';
        this.jsonSchema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                },
                "secondName": {
                    "type": "string"
                }
            }
        };
        this.name = 'JsonFormAction';
        this.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": "First Name",
                    "scope": "#/properties/name"
                },
                {
                    "type": "Control",
                    "label": "Second Name",
                    "scope": "#/properties/secondName",
                }
            ]
        };
        this.displayTool = true;
        this.displayContext = false;
        this.selectedItemTypes = [];
        this.type = 'json-forms';
    }
    getLink() {
        return Promise.resolve("");
    }
    getPopUpHTML() {
        return Promise.resolve(JSON.stringify({ schema: this.jsonSchema, UISchema: this.uiSchema }));
    }
    handler(items, data) {
        console.log('JsonFormAction handler items: ', items);
        console.log('JsonFormAction handler data: ', data);
        return new Promise((resolve, reject) => {
            resolve({ ok: true });
        });
    }
}
exports.JsonFormAction = JsonFormAction;
