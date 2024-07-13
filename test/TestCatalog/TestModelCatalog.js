"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAction = exports.Link = exports.TestModelCatalog = exports.Page = exports.ModelGroup = void 0;
const AbstractCatalog_1 = require("../../lib/catalog/AbstractCatalog");
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
        return await sails.models[this.model].findOne({ id: itemId });
    }
    async update(itemId, data) {
        // allowed only parentId update
        return await sails.models[this.model].update({ id: itemId }, { name: data.name, parentId: data.parentId }).fetch();
    }
    ;
    // public async create(itemId: string, data: Item): Promise<Item> {
    // 	throw `I dont know for what need it`
    // 	// return await sails.models.create({ name: data.name, parentId: data.parentId}).fetch();
    // 	// return await StorageService.setElement(itemId, data);
    // }
    async deleteItem(itemId) {
        await sails.models[this.model].destroy({ id: itemId });
        //	await StorageService.removeElementById(itemId);
    }
    getAddHTML() {
        let type = 'link';
        return {
            type: type,
            data: `/admin/model/${this.model}/add?without_layout=true`
        };
    }
    async getEditHTML(id) {
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
        console.log(this.type, parentId, await sails.models[this.model].find({ parentId: parentId }));
        return await sails.models[this.model].find({ parentId: parentId });
    }
    async search(s) {
        return await sails.models[this.model].find({ name: { contain: s } });
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
class TestModelCatalog extends AbstractCatalog_1.AbstractCatalog {
    //  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];
    constructor() {
        super([
            new ModelGroup(),
            new Page()
        ]);
        this.name = "test model catalog";
        this.slug = "testModel";
        this.maxNestingDepth = null;
        this.icon = "box";
        this.actionHandlers = [];
        this.addActionHandler(new Link());
        this.addActionHandler(new ContextAction());
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
    handler(items, config) {
        const generateRandomString = () => {
            return Math.floor(Math.random() * Date.now()).toString(36);
        };
        setTimeout(async () => {
            for (const item of items) {
                let data = item;
                data.name = generateRandomString();
                console.log("await StorageService.setElement(item.id, data) <<<");
            }
        }, 10000);
        return Promise.resolve({
            data: 'ok',
            type: this.type
        });
    }
}
exports.ContextAction = ContextAction;
