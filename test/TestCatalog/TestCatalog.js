"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadTree = exports.TestCatalog = exports.Page = exports.Item2 = exports.Item1 = exports.TestGroup = exports.StorageService = void 0;
const AbstractCatalog_1 = require("../../lib/catalog/AbstractCatalog");
const fs = require("node:fs");
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
class TestGroup extends AbstractCatalog_1.AbstractGroup {
    constructor() {
        super(...arguments);
        this.name = "Group";
        this.allowedRoot = true;
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
        let item = await StorageService.setElement(id, newData);
        if (item.parentId !== null) {
            let parent = await StorageService.findElementById(item.parentId);
            parent.childs.push(item);
        }
        return item;
    }
    async deleteItem(itemId) {
        await StorageService.removeElementById(itemId);
    }
    getAddHTML() {
        let type = 'html';
        return {
            type: type,
            data: fs.readFileSync(`${__dirname}/groupAdd.html`, 'utf8'),
        };
    }
    async getEditHTML(id) {
        let type = 'html';
        let item = await StorageService.findElementById(id);
        return {
            type: type,
            data: `<div class="custom-catalog__form">
					<div class="flex flex-col gap-3">
					<div class="admin-panel__wrapper-title">
					<label class="admin-panel__title" for="form-title">Title for Group</label>
					</div>
					<div class="admin-panel__widget">
					<div class="widget_narrow ">
					<input class="text-input w-full" type="text" placeholder="Title" value="${item.name}" name="title"
					id="group-form-title" required/>
					</div>
					</div>
					</div>
					<div>
					<button class="btn btn-green" id="save-group">
					Save
					</button>
					</div>
					</div>
					<script>
					{
						let btn = document.getElementById('save-group')
						let item = ${JSON.stringify(item)}
						btn.addEventListener('click', async function () {
							item.name = document.getElementById('group-form-title').value
							let res = await ky.put('', {json: {type: item.type, data: item, id: item.id, _method: 'updateItem'}}).json()
							if (res.data) document.getElementById('checkbox-ready').click()
						})
					}
					</script>`,
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
        await StorageService.removeElementById(itemId);
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
    getAddHTML() {
        let type = 'html';
        return {
            type: type,
            data: fs.readFileSync(`${__dirname}/item2Add.html`, 'utf8'),
        };
    }
    async getEditHTML(id) {
        let type = 'html';
        let item = await StorageService.findElementById(id);
        return {
            type: type,
            data: `<div class="custom-catalog__form">
					<div class="flex flex-col gap-3">
					<div class="admin-panel__wrapper-title">
					<label class="admin-panel__title" for="form-title">Title for Item2</label>
					</div>
					<div class="admin-panel__widget">
					<div class="widget_narrow ">
					<input class="text-input w-full" type="text" placeholder="Title" value="${item.name}" name="title"
					id="group-form-title" required/>
					</div>
					</div>
					</div>
					<div>
					<button class="btn btn-green" id="save-group">
					Save
					</button>
					</div>
					</div>
					<script>
					{
						let btn = document.getElementById('save-group')
						let item = ${JSON.stringify(item)}
						btn.addEventListener('click', async function () {
							item.name = document.getElementById('group-form-title').value
							let res = await ky.put('', {json: {type: item.type, data: item, id: item.id, _method: 'updateItem'}}).json()
							if (res.data) document.getElementById('checkbox-ready').click()
						})
					}
					</script>`,
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
        let item = await StorageService.setElement(id, newData);
        if (item.parentId !== null) {
            let parent = await StorageService.findElementById(item.parentId);
            parent.childs.push(item);
        }
        return item;
    }
    async update(itemId, data) {
        return await StorageService.setElement(itemId, data);
    }
    ;
}
exports.Item2 = Item2;
class Page extends AbstractCatalog_1.AbstractItem {
    constructor() {
        super(...arguments);
        this.type = "page";
        this.name = "Page";
        this.allowedRoot = true;
        this.icon = "file";
    }
    async find(itemId) {
        console.log(itemId, "FIND");
        return await sails.models['page'].findOne({ id: itemId });
    }
    async update(itemId, data) {
        // allowed only parentID update
        return await sails.models['page'].update({ id: itemId }, data).fetch();
    }
    ;
    async create(itemId, data) {
        throw `I dont know for what need it`;
        return await sails.models.create({ name: data.name, parentId: data.parentId }).fetch();
        return await StorageService.setElement(itemId, data);
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
        return await sails.models['page'].find({ parentId: parentId });
    }
    async search(s) {
        return await sails.models['page'].find({ name: { contain: s } });
    }
}
exports.Page = Page;
class TestCatalog extends AbstractCatalog_1.AbstractCatalog {
    //  public readonly itemTypes: (Item2 | Item1 | TestGroup)[];
    constructor() {
        super([
            new TestGroup(),
            new Item1(),
            new Item2(),
            new Page()
        ]);
        this.name = "test catalog";
        this.slug = "test";
        this.maxNestingDepth = null;
        this.icon = "box";
        this.actionHandlers = [];
        this.addActionHandler(new DownloadTree());
    }
}
exports.TestCatalog = TestCatalog;
class DownloadTree extends AbstractCatalog_1.ActionHandler {
    constructor() {
        super(...arguments);
        this.icon = 'cat';
        this.id = 'download';
        this.name = 'Download Items';
        this.displayTool = true;
        this.displayContext = false;
        this.type = 'basic';
        this.selectedItemTypes = [];
    }
    getLink() {
        return Promise.resolve("");
    }
    getPopUpHTML() {
        return Promise.resolve("");
    }
    handler(items, config) {
        let date = new Date().valueOf();
        if (fs.existsSync(`${filepath}`)) {
            fs.rmSync(`${filepath}`, { recursive: true, force: true });
            fs.mkdirSync(`${filepath}`, { recursive: true });
        }
        else {
            fs.mkdirSync(`${filepath}`, { recursive: true });
        }
        fs.writeFileSync(`${filepath}/${date}.json`, JSON.stringify(items, null, 2));
        // // zip archive of your folder is ready to download
        // res.download(folderpath + '/archive.zip');
        return Promise.resolve({
            data: `files/${date}.json`,
            type: this.type,
            event: 'download'
        });
    }
}
exports.DownloadTree = DownloadTree;
