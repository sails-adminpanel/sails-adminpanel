"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGroup = exports.NavigationItem = exports.Navigation = void 0;
const AbstractCatalog_1 = require("./AbstractCatalog");
class Navigation extends AbstractCatalog_1.AbstractCatalog {
    constructor(config) {
        let items = [];
        for (const configElement of config.items) {
            items.push(new NavigationItem(configElement.name, configElement.model));
        }
        items.push(new NavigationGroup(config.groupItem.name, config.groupItem.model));
        super(items);
        this.name = 'Navigation';
        this.slug = 'navigation';
        this.icon = "box";
        this.actionHandlers = [];
    }
}
exports.Navigation = Navigation;
class NavigationItem extends AbstractCatalog_1.AbstractItem {
    constructor(name, model) {
        super();
        this.allowedRoot = true;
        this.icon = 'align-justify';
        this.actionHandlers = [];
        this.name = name;
        this.model = model.toLowerCase();
        this.type = model.toLowerCase();
    }
    async find(itemId) {
        console.log(itemId);
        return await sails.models[this.model].findOne({ id: itemId });
    }
    create(catalogId, data) {
        console.log('create: ', catalogId, data);
        return Promise.resolve(undefined);
    }
    deleteItem(itemId) {
        return Promise.resolve(undefined);
    }
    getAddHTML() {
        let type = 'link';
        return {
            type: type,
            data: `/admin/model/${this.model}/add?without_layout=true`
        };
    }
    getChilds(parentId) {
        return Promise.resolve([]);
    }
    getEditHTML(id) {
        return Promise.resolve({ data: "", type: undefined });
    }
    search(s) {
        return Promise.resolve([]);
    }
    update(itemId, data) {
        return Promise.resolve(undefined);
    }
}
exports.NavigationItem = NavigationItem;
class NavigationGroup extends NavigationItem {
    constructor(name, model) {
        super(name, model);
        this.icon = 'layer-group';
        this.isGroup = true;
    }
}
exports.NavigationGroup = NavigationGroup;
